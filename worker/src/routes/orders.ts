import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function createNotification(env:Env,userId:string,title:string,message:string){try{await env.DB.prepare("INSERT INTO notifications(id,user_id,title,message,type) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),userId,title,message,"info").run();}catch{/* Do not block order placement for notification failure. */}}
export function matchesOrdersRoute(path:string,method:string){return (path==="/api/orders"&&(method==="GET"||method==="POST"))||(path.startsWith("/api/orders/")&&(method==="GET"||method==="POST"));}
export async function handleOrdersRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesOrdersRoute(url.pathname,request.method))return null;
if(url.pathname==="/api/orders"&&request.method==="GET"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to view your orders.");
  const result=await env.DB.prepare("SELECT o.*,m.store_name FROM orders o JOIN merchant_profiles m ON m.id=o.merchant_id WHERE o.customer_id=? ORDER BY o.created_at DESC LIMIT 100").bind(user.id).all<any>();
  return json({data:{items:result.results||[]}});
 }
 if(url.pathname==="/api/orders"&&request.method==="POST"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in before placing an order.");if(user.status!=="active")return fail(403,"ACCOUNT_NOT_ACTIVE","Your account cannot place orders yet.");
  let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
  const recipientName=String(body.recipientName||"").trim(),recipientPhone=String(body.recipientPhone||"").trim(),addressLine=String(body.addressLine||"").trim(),city=String(body.city||"").trim(),area=String(body.area||"").trim(),notes=String(body.notes||"").trim();
  if(recipientName.length<2||recipientName.length>90||recipientPhone.length<7||recipientPhone.length>30||addressLine.length<5||addressLine.length>250||city.length<2||city.length>80||area.length>100||notes.length>500)return fail(422,"INVALID_ADDRESS","Complete the delivery contact and address details.");
  if(body.paymentMethod&&body.paymentMethod!=="cash_on_delivery")return fail(422,"PAYMENT_METHOD_UNAVAILABLE","Cash on delivery is the only payment method enabled in this preview.");
  if(!Array.isArray(body.items)||body.items.length<1||body.items.length>30)return fail(422,"INVALID_CART","Your cart is empty or contains too many items.");
  const quantities=new Map<string,number>();for(const entry of body.items){const id=String(entry.productId||""),qty=Number(entry.quantity);if(!id||!Number.isSafeInteger(qty)||qty<1||qty>99)return fail(422,"INVALID_CART_ITEM","Check the product and quantity in your cart.");quantities.set(id,(quantities.get(id)||0)+qty);}
  const groups=new Map<string,{merchantId:string;merchantUserId:string;items:Array<{id:string;name:string;sku:string|null;price:number;quantity:number}>;subtotal:number}>();
  for(const [productId,quantity] of quantities){
   const product=await env.DB.prepare("SELECT p.*,m.id AS active_merchant_id,m.user_id AS merchant_user_id FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.id=? AND p.status='active' AND m.status='active' AND u.status='active'").bind(productId).first<any>();
   if(!product)return fail(409,"PRODUCT_UNAVAILABLE","One of the selected products is no longer available.");
   if(product.stock_quantity<quantity)return fail(409,"INSUFFICIENT_STOCK",`Not enough stock for ${product.name}. Please update your cart.`);
   const group:{merchantId:string;merchantUserId:string;items:Array<{id:string;name:string;sku:string|null;price:number;quantity:number}>;subtotal:number}=groups.get(product.merchant_id)||{merchantId:product.merchant_id,merchantUserId:product.merchant_user_id,items:[],subtotal:0};
   group.items.push({id:product.id,name:product.name,sku:product.sku,price:product.price_piasters,quantity});group.subtotal+=product.price_piasters*quantity;groups.set(product.merchant_id,group);
  }
  const created:Array<{id:string;orderNumber:string;totalPiasters:number}>=[];
  for(const group of groups.values()){
   const id=crypto.randomUUID(),orderNumber="PH"+new Date().toISOString().slice(2,10).replace(/-/g,"")+randomToken(3).slice(0,6).toUpperCase();
   const statements=[env.DB.prepare("INSERT INTO orders(id,order_number,customer_id,merchant_id,subtotal_piasters,total_piasters,recipient_name,recipient_phone,address_line,city,area,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,orderNumber,user.id,group.merchantId,group.subtotal,group.subtotal,recipientName,recipientPhone,addressLine,city,area,notes)];
   for(const item of group.items)statements.push(env.DB.prepare("INSERT INTO order_items(id,order_id,product_id,product_name,sku,unit_price_piasters,quantity,line_total_piasters) VALUES(?,?,?,?,?,?,?,?)").bind(crypto.randomUUID(),id,item.id,item.name,item.sku,item.price,item.quantity,item.price*item.quantity));
   await env.DB.batch(statements);await createNotification(env,group.merchantUserId,"New customer order",`Order ${orderNumber} has been placed and is waiting for your confirmation.`,"info");created.push({id,orderNumber,totalPiasters:group.subtotal});
  }
  return json({data:{orders:created}},201);
 }


 if(url.pathname==="/api/notifications"&&request.method==="GET"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to view notifications.");
  const rows=await env.DB.prepare("SELECT id,title,message,type,read_at,created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(user.id).all<any>();return json({data:{items:rows.results||[]}});
 }
 if(url.pathname.startsWith("/api/notifications/")&&request.method==="POST"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to continue.");
  const id=url.pathname.slice("/api/notifications/".length).replace(/\/read$/,"");
  const result=await env.DB.prepare("UPDATE notifications SET read_at=? WHERE id=? AND user_id=?").bind(new Date().toISOString(),id,user.id).run();return result.meta.changes?json({data:{success:true}}):fail(404,"NOTIFICATION_NOT_FOUND","Notification was not found.");
 }
 if(url.pathname==="/api/support/tickets"&&request.method==="GET"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to view support requests.");
  const result=await env.DB.prepare("SELECT id,ticket_number,category,subject,message,status,admin_note,created_at,updated_at FROM support_tickets WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(user.id).all<any>();return json({data:{items:result.results||[]}});
 }
 if(url.pathname==="/api/support/tickets"&&request.method==="POST"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to contact support.");
  let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
  const category=String(body.category||"other"),subject=String(body.subject||"").trim(),message=String(body.message||"").trim();
  if(!["order","account","payment","delivery","product","other"].includes(category)||subject.length<5||subject.length>120||message.length<10||message.length>3000)return fail(422,"INVALID_TICKET","Check the support category, subject, and message.");
  const id=crypto.randomUUID(),ticketNumber="SUP"+new Date().toISOString().slice(2,10).replace(/-/g,"")+randomToken(3).slice(0,6).toUpperCase();
  await env.DB.prepare("INSERT INTO support_tickets(id,ticket_number,user_id,category,subject,message) VALUES(?,?,?,?,?,?)").bind(id,ticketNumber,user.id,category,subject,message).run();return json({data:{id,ticketNumber,status:"open"}},201);
 }
 if(url.pathname.startsWith("/api/orders/")){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to continue.");
  const segments=url.pathname.split("/").filter(Boolean),id=segments[2];
  if(segments.length===3&&request.method==="GET"){
   const order=await env.DB.prepare("SELECT o.*,m.store_name FROM orders o JOIN merchant_profiles m ON m.id=o.merchant_id WHERE o.id=? AND o.customer_id=?").bind(id,user.id).first<any>();if(!order)return fail(404,"ORDER_NOT_FOUND","Order was not found.");
   const items=await env.DB.prepare("SELECT product_id,product_name,sku,unit_price_piasters,quantity,line_total_piasters FROM order_items WHERE order_id=?").bind(id).all<any>();return json({data:{order,items:items.results||[]}});
  }
  if(segments.length===4&&segments[3]==="cancel"&&request.method==="POST"){
   const result=await env.DB.prepare("UPDATE orders SET status='cancelled',updated_at=? WHERE id=? AND customer_id=? AND status='pending'").bind(new Date().toISOString(),id,user.id).run();
   return result.meta.changes?json({data:{success:true}}):fail(409,"ORDER_CANNOT_CANCEL","This order can no longer be cancelled.");
  }
 }
 
return null;}
