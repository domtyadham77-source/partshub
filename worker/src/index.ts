export interface Env { DB:D1Database; ALLOWED_ORIGIN?:string; SESSION_TTL_DAYS?:string }
type PublicUser={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200,headers:HeadersInit={})=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function corsHeaders(request:Request,env:Env){const origin=request.headers.get("Origin");const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(v=>v.trim()).filter(Boolean);const headers=new Headers();if(origin&&allowed.includes(origin)){headers.set("Access-Control-Allow-Origin",origin);headers.set("Access-Control-Allow-Credentials","true");headers.set("Vary","Origin");}headers.set("Access-Control-Allow-Methods","GET,POST,OPTIONS");headers.set("Access-Control-Allow-Headers","Content-Type");headers.set("Access-Control-Max-Age","86400");return headers;}
function secureHeaders(response:Response){const h=new Headers(response.headers);h.set("X-Content-Type-Options","nosniff");h.set("Referrer-Policy","strict-origin-when-cross-origin");h.set("X-Frame-Options","DENY");h.set("Permissions-Policy","camera=(), microphone=(), geolocation=()");return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});}
function cookieValue(request:Request,name:string){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="))?.slice(name.length+1)||null;}
function hex(bytes:ArrayBuffer){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function digest(value:string){return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));}
async function passwordHash(password:string,salt:string,iterations=310000){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(salt.match(/.{2}/g)!.map(x=>parseInt(x,16))),iterations,hash:"SHA-256"},key,256);return hex(bits);}
function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;}
function publicUser(row:any):PublicUser{return{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at};}
async function allowAuthAttempt(request:Request,env:Env,scope:string,limit:number,windowSeconds=900){
 const ip=request.headers.get("CF-Connecting-IP")||"unknown";
 const key=await digest(scope+":"+ip);
 const since=new Date(Date.now()-windowSeconds*1000).toISOString();
 const row=await env.DB.prepare("SELECT COUNT(*) AS total FROM auth_attempts WHERE key_hash=? AND created_at>?").bind(key,since).first<{total:number}>();
 await env.DB.prepare("INSERT INTO auth_attempts(id,key_hash) VALUES(?,?)").bind(crypto.randomUUID(),key).run();
 await env.DB.prepare("DELETE FROM auth_attempts WHERE created_at<?").bind(new Date(Date.now()-86400000).toISOString()).run();
 return (row?.total||0)<limit;
}

type MerchantRow={id:string;user_id:string;store_name:string;description:string;contact_phone:string|null;status:string};
function publicProduct(row:any){return{id:row.id,name:row.name,category:row.category,fitment:row.fitment,sku:row.sku,description:row.description,pricePiasters:row.price_piasters,stockQuantity:row.stock_quantity,status:row.status,seller:row.store_name,createdAt:row.created_at};}
async function merchantFor(request:Request,env:Env,allowPending=false){const user=await readUser(request,env);if(!user)return{error:fail(401,"UNAUTHENTICATED","Sign in to continue.")};if(user.role!=="merchant")return{error:fail(403,"MERCHANT_ONLY","A merchant account is required.")};const merchant=await env.DB.prepare("SELECT * FROM merchant_profiles WHERE user_id=?").bind(user.id).first<MerchantRow>();if(!merchant)return{error:fail(404,"MERCHANT_PROFILE_MISSING","Merchant profile was not found.")};if(merchant.status!=="active"&&!allowPending)return{error:fail(403,"MERCHANT_NOT_APPROVED","Your seller account must be approved before managing listings.")};return{user,merchant};}
async function readUser(request:Request,env:Env){const token=cookieValue(request,"ph_session");if(!token)return null;const hash=await digest(token);const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(hash,new Date().toISOString()).first<any>();return row?publicUser(row):null;}
async function createSession(userId:string,env:Env){const token=randomToken();const days=Math.min(30,Math.max(1,Number(env.SESSION_TTL_DAYS)||14));const expires=new Date(Date.now()+days*86400000).toISOString();await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),userId,await digest(token),expires).run();return {token,expires};}
function cookie(token:string,maxAge:number){return `ph_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;}
function clearCookie(){return "ph_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";}
async function handle(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders(request,env)});
 if(url.pathname==="/api/health")return json({data:{ok:true,service:"parts-hub-api"}});


 if(url.pathname==="/api/products"&&request.method==="GET"){
  const q=(url.searchParams.get("q")||"").trim().slice(0,80),category=url.searchParams.get("category")||"",limit=Math.min(48,Math.max(1,Number(url.searchParams.get("limit"))||24));
  if(category&&!["car_parts","motorcycle_parts","workshop"].includes(category))return fail(400,"INVALID_CATEGORY","Choose a valid product category.");
  let sql="SELECT p.*,m.store_name FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.status='active' AND m.status='active' AND u.status='active'";
  const values:(string|number)[]=[];if(category){sql+=" AND p.category=?";values.push(category);}if(q){sql+=" AND (p.name LIKE ? OR p.fitment LIKE ? OR p.sku LIKE ?)";values.push("%"+q+"%","%"+q+"%","%"+q+"%");}
  sql+=" ORDER BY p.created_at DESC LIMIT ?";values.push(limit);
  const result=await env.DB.prepare(sql).bind(...values).all<any>();return json({data:{items:(result.results||[]).map(publicProduct)}});
 }
 if(url.pathname.startsWith("/api/products/")&&request.method==="GET"){
  const id=url.pathname.slice("/api/products/".length);const row=await env.DB.prepare("SELECT p.*,m.store_name FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.id=? AND p.status='active' AND m.status='active' AND u.status='active'").bind(id).first<any>();
  return row?json({data:{product:publicProduct(row)}}):fail(404,"PRODUCT_NOT_FOUND","This product listing is unavailable.");
 }
 const origin=request.headers.get("Origin");const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(x=>x.trim()).filter(Boolean);if(origin&&origin!==url.origin&&!allowed.includes(origin))return fail(403,"ORIGIN_NOT_ALLOWED","This origin is not allowed.");



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
  const groups=new Map<string,{merchantId:string;items:Array<{id:string;name:string;sku:string|null;price:number;quantity:number}>;subtotal:number}>();
  for(const [productId,quantity] of quantities){
   const product=await env.DB.prepare("SELECT p.*,m.id AS active_merchant_id FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.id=? AND p.status='active' AND m.status='active' AND u.status='active'").bind(productId).first<any>();
   if(!product)return fail(409,"PRODUCT_UNAVAILABLE","One of the selected products is no longer available.");
   if(product.stock_quantity<quantity)return fail(409,"INSUFFICIENT_STOCK",`Not enough stock for ${product.name}. Please update your cart.`);
   const group:{merchantId:string;items:Array<{id:string;name:string;sku:string|null;price:number;quantity:number}>;subtotal:number}=groups.get(product.merchant_id)||{merchantId:product.merchant_id,items:[],subtotal:0};
   group.items.push({id:product.id,name:product.name,sku:product.sku,price:product.price_piasters,quantity});group.subtotal+=product.price_piasters*quantity;groups.set(product.merchant_id,group);
  }
  const created:Array<{id:string;orderNumber:string;totalPiasters:number}>=[];
  for(const group of groups.values()){
   const id=crypto.randomUUID(),orderNumber="PH"+new Date().toISOString().slice(2,10).replace(/-/g,"")+randomToken(3).slice(0,6).toUpperCase();
   const statements=[env.DB.prepare("INSERT INTO orders(id,order_number,customer_id,merchant_id,subtotal_piasters,total_piasters,recipient_name,recipient_phone,address_line,city,area,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,orderNumber,user.id,group.merchantId,group.subtotal,group.subtotal,recipientName,recipientPhone,addressLine,city,area,notes)];
   for(const item of group.items)statements.push(env.DB.prepare("INSERT INTO order_items(id,order_id,product_id,product_name,sku,unit_price_piasters,quantity,line_total_piasters) VALUES(?,?,?,?,?,?,?,?)").bind(crypto.randomUUID(),id,item.id,item.name,item.sku,item.price,item.quantity,item.price*item.quantity));
   await env.DB.batch(statements);created.push({id,orderNumber,totalPiasters:group.subtotal});
  }
  return json({data:{orders:created}},201);
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
 if(url.pathname.startsWith("/api/admin/")){
  const admin=await readUser(request,env);if(!admin)return fail(401,"UNAUTHENTICATED","Sign in to continue.");if(admin.role!=="admin"||admin.status!=="active")return fail(403,"ADMIN_ONLY","Administrator access is required.");
  if(url.pathname==="/api/admin/overview"&&request.method==="GET"){
   const [users,merchants,products]=await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total FROM users").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM merchant_profiles WHERE status='pending'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM products").first<any>()
   ]);
   return json({data:{users:users?.total||0,pendingMerchants:merchants?.total||0,products:products?.total||0}});
  }
  if(url.pathname==="/api/admin/products"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"draft";if(!["draft","active","archived"].includes(status))return fail(400,"INVALID_STATUS","Choose a valid product status.");
   const result=await env.DB.prepare("SELECT p.*,m.store_name FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id WHERE p.status=? ORDER BY p.created_at ASC LIMIT 100").bind(status).all<any>();
   return json({data:{items:(result.results||[]).map(publicProduct)}});
  }
  if(url.pathname==="/api/admin/merchants"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"pending";if(!["pending","active","rejected","suspended"].includes(status))return fail(400,"INVALID_STATUS","Choose a valid merchant status.");
   const result=await env.DB.prepare("SELECT m.id,m.store_name,m.description,m.contact_phone,m.status,m.created_at,u.full_name,u.email FROM merchant_profiles m JOIN users u ON u.id=m.user_id WHERE m.status=? ORDER BY m.created_at ASC LIMIT 100").bind(status).all<any>();
   return json({data:{items:result.results||[]}});
  }
  const merchantParts=url.pathname.split("/").filter(Boolean);
  if(merchantParts.length===5&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="merchants"&&merchantParts[4]==="status"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||"");if(!["active","rejected","suspended"].includes(status))return fail(422,"INVALID_STATUS","Choose active, rejected, or suspended.");
   const result=await env.DB.prepare("UPDATE merchant_profiles SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();
   if(!result.meta.changes)return fail(404,"MERCHANT_NOT_FOUND","Merchant profile was not found.");
   if(status==="active")await env.DB.prepare("UPDATE users SET status='active',updated_at=? WHERE id=(SELECT user_id FROM merchant_profiles WHERE id=?)").bind(new Date().toISOString(),id).run();
   return json({data:{success:true,status}});
  }
  if(merchantParts.length===5&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="products"&&merchantParts[4]==="status"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||"");if(!["active","archived"].includes(status))return fail(422,"INVALID_STATUS","Choose active or archived.");
   const product=await env.DB.prepare("SELECT p.id,m.status AS merchant_status,u.status AS user_status FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.id=?").bind(id).first<any>();
   if(!product)return fail(404,"PRODUCT_NOT_FOUND","Product listing was not found.");
   if(status==="active"&&(product.merchant_status!=="active"||product.user_status!=="active"))return fail(409,"MERCHANT_NOT_APPROVED","Approve the merchant before activating product listings.");
   await env.DB.prepare("UPDATE products SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();return json({data:{success:true,status}});
  }
  return fail(404,"NOT_FOUND","Admin endpoint not found.");
 }
 if(url.pathname.startsWith("/api/merchant/")){
  const isProfile=url.pathname==="/api/merchant/profile";
  const context=await merchantFor(request,env,isProfile&&(request.method==="GET"||request.method==="PATCH"));
  if(context.error)return context.error;
  const merchant=context.merchant;
  if(isProfile&&request.method==="GET")return json({data:{merchant:{id:merchant.id,storeName:merchant.store_name,description:merchant.description,contactPhone:merchant.contact_phone,status:merchant.status}}});
  if(isProfile&&request.method==="PATCH"){
   let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const storeName=String(body.storeName??merchant.store_name).trim(),description=String(body.description??merchant.description).trim(),phone=String(body.contactPhone??merchant.contact_phone??"").trim()||null;
   if(storeName.length<2||storeName.length>100||description.length>1000||(phone&&phone.length>30))return fail(422,"INVALID_PROFILE","Check your store name, description, and phone.");
   await env.DB.prepare("UPDATE merchant_profiles SET store_name=?,description=?,contact_phone=?,updated_at=? WHERE id=?").bind(storeName,description,phone,new Date().toISOString(),merchant.id).run();
   return json({data:{success:true}});
  }

  if(url.pathname==="/api/merchant/orders"&&request.method==="GET"){
   const rows=await env.DB.prepare("SELECT o.*,u.full_name AS customer_name FROM orders o JOIN users u ON u.id=o.customer_id WHERE o.merchant_id=? ORDER BY o.created_at DESC LIMIT 100").bind(merchant.id).all<any>();return json({data:{items:rows.results||[]}});
  }
  const orderSegments=url.pathname.split("/").filter(Boolean);
  if(orderSegments.length===4&&orderSegments[0]==="api"&&orderSegments[1]==="merchant"&&orderSegments[2]==="orders"&&request.method==="POST"){
   const orderId=orderSegments[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const next=String(body.status||"");if(!["accepted","rejected","processing","shipped","delivered"].includes(next))return fail(422,"INVALID_ORDER_STATUS","Choose a valid order status.");
   const order=await env.DB.prepare("SELECT * FROM orders WHERE id=? AND merchant_id=?").bind(orderId,merchant.id).first<any>();if(!order)return fail(404,"ORDER_NOT_FOUND","Order was not found.");
   const allowed:Record<string,string[]>={pending:["accepted","rejected"],accepted:["processing"],processing:["shipped"],shipped:["delivered"]};if(!allowed[order.status]?.includes(next))return fail(409,"INVALID_ORDER_TRANSITION","This order cannot move to that status.");
   const reservedItems:Array<{id:string;quantity:number}>=[];
   if(next==="accepted"){
    const items=await env.DB.prepare("SELECT product_id,quantity FROM order_items WHERE order_id=?").bind(orderId).all<any>();
    for(const item of items.results||[]){const result=await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity-?,updated_at=? WHERE id=? AND stock_quantity>=? AND status='active'").bind(item.quantity,new Date().toISOString(),item.product_id,item.quantity).run();if(!result.meta.changes){for(const previous of changed)await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity+? WHERE id=?").bind(previous.quantity,previous.id).run();return fail(409,"INSUFFICIENT_STOCK","Stock changed before this order could be accepted.");}reservedItems.push({id:item.product_id,quantity:item.quantity});}
   }
   const result=await env.DB.prepare("UPDATE orders SET status=?,updated_at=? WHERE id=? AND merchant_id=? AND status=?").bind(next,new Date().toISOString(),orderId,merchant.id,order.status).run();
   if(!result.meta.changes){for(const reserved of reservedItems)await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity+? WHERE id=?").bind(reserved.quantity,reserved.id).run();return fail(409,"ORDER_UPDATED","This order was updated by another request. Refresh and try again.");}
   return json({data:{success:true,status:next}});
  }
  if(url.pathname==="/api/merchant/products"&&request.method==="GET"){
   const rows=await env.DB.prepare("SELECT p.*,m.store_name FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id WHERE p.merchant_id=? ORDER BY p.created_at DESC LIMIT 100").bind(merchant.id).all<any>();
   return json({data:{items:(rows.results||[]).map(publicProduct)}});
  }
  if(url.pathname==="/api/merchant/products"&&request.method==="POST"){
   let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const name=String(body.name||"").trim(),category=String(body.category||""),fitment=String(body.fitment||"").trim(),description=String(body.description||"").trim(),sku=String(body.sku||"").trim()||null,price=Number(body.pricePiasters),stock=Number(body.stockQuantity??0);
   if(name.length<3||name.length>140||!["car_parts","motorcycle_parts","workshop"].includes(category)||fitment.length>160||description.length>3000||!Number.isSafeInteger(price)||price<1||!Number.isSafeInteger(stock)||stock<0||stock>1000000)return fail(422,"INVALID_PRODUCT","Check the product name, category, price, and stock quantity.");
   const id=crypto.randomUUID();await env.DB.prepare("INSERT INTO products(id,merchant_id,name,category,fitment,sku,description,price_piasters,stock_quantity,status) VALUES(?,?,?,?,?,?,?,?,?,'draft')").bind(id,merchant.id,name,category,fitment,sku,description,price,stock).run();
   return json({data:{id,status:"draft"}},201);
  }
  const segments=url.pathname.split("/").filter(Boolean);
  if(segments.length===4&&segments[0]==="api"&&segments[1]==="merchant"&&segments[2]==="products"){
   const id=segments[3],item=await env.DB.prepare("SELECT * FROM products WHERE id=? AND merchant_id=?").bind(id,merchant.id).first<any>();
   if(!item)return fail(404,"PRODUCT_NOT_FOUND","Product listing was not found.");
   if(request.method==="DELETE"){await env.DB.prepare("UPDATE products SET status='archived',updated_at=? WHERE id=?").bind(new Date().toISOString(),id).run();return json({data:{success:true}});}
   if(request.method==="PATCH"){
    let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
    const name=String(body.name??item.name).trim(),fitment=String(body.fitment??item.fitment).trim(),description=String(body.description??item.description).trim(),sku=body.sku===undefined?item.sku:(String(body.sku).trim()||null),price=Number(body.pricePiasters??item.price_piasters),stock=Number(body.stockQuantity??item.stock_quantity);
    if(name.length<3||name.length>140||fitment.length>160||description.length>3000||!Number.isSafeInteger(price)||price<1||!Number.isSafeInteger(stock)||stock<0||stock>1000000)return fail(422,"INVALID_PRODUCT","Check the product name, price, and stock quantity.");
    await env.DB.prepare("UPDATE products SET name=?,fitment=?,description=?,sku=?,price_piasters=?,stock_quantity=?,updated_at=? WHERE id=?").bind(name,fitment,description,sku,price,stock,new Date().toISOString(),id).run();return json({data:{success:true}});
   }
  }
  return fail(404,"NOT_FOUND","Merchant endpoint not found.");
 }
 if(request.method==="GET"&&url.pathname==="/api/auth/me"){const user=await readUser(request,env);return json({data:{user}});}
 if(request.method==="POST"&&url.pathname==="/api/auth/logout"){const token=cookieValue(request,"ph_session");if(token)await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();return json({data:{success:true}},200,{"Set-Cookie":clearCookie()});}
 if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED","Method not allowed.");
 let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
 if(url.pathname==="/api/auth/register"){
  if(!await allowAuthAttempt(request,env,"register",6))return fail(429,"RATE_LIMITED","Too many sign-up attempts. Try again later.");
  const fullName=String(body.fullName||"").trim(),email=String(body.email||"").trim().toLowerCase(),phone=String(body.phone||"").trim()||null,password=String(body.password||""),role=body.role==="merchant"?"merchant":"customer";
  if(fullName.length<2||fullName.length>90)return fail(422,"INVALID_NAME","Enter your full name.");
  if(!validEmail(email))return fail(422,"INVALID_EMAIL","Enter a valid email address.");
  if(phone&&phone.length>30)return fail(422,"INVALID_PHONE","Enter a valid phone number.");
  if(password.length<10||password.length>128)return fail(422,"WEAK_PASSWORD","Password must be at least 10 characters.");
  const existing=await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();if(existing)return fail(409,"EMAIL_EXISTS","An account with this email already exists.");
  const id=crypto.randomUUID(),salt=randomToken(16),hash=await passwordHash(password,salt);
  try{const statements=[env.DB.prepare("INSERT INTO users(id,full_name,email,phone,role,status,password_hash,password_salt) VALUES(?,?,?,?,?,?,?,?)").bind(id,fullName,email,phone,role,role==="merchant"?"pending":"active",hash,salt)];if(role==="merchant")statements.push(env.DB.prepare("INSERT INTO merchant_profiles(id,user_id,store_name,status) VALUES(?,?,?,?)").bind(crypto.randomUUID(),id,fullName,"pending"));await env.DB.batch(statements);}catch{return fail(409,"EMAIL_EXISTS","An account with this email already exists.");}
  const session=await createSession(id,env);const row=await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(id).first<any>();const maxAge=Math.floor((new Date(session.expires).getTime()-Date.now())/1000);
  return json({data:{user:publicUser(row)}},201,{"Set-Cookie":cookie(session.token,maxAge)});
 }
 if(url.pathname==="/api/auth/login"){
  if(!await allowAuthAttempt(request,env,"login",8))return fail(429,"RATE_LIMITED","Too many sign-in attempts. Try again in 15 minutes.");
  const email=String(body.email||"").trim().toLowerCase(),password=String(body.password||"");if(!validEmail(email)||!password)return fail(422,"INVALID_CREDENTIALS","Enter your email and password.");
  const row=await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first<any>();if(!row)return fail(401,"INVALID_CREDENTIALS","Email or password is incorrect.");
  const candidate=await passwordHash(password,row.password_salt,row.password_iterations);if(candidate!==row.password_hash)return fail(401,"INVALID_CREDENTIALS","Email or password is incorrect.");
  if(row.status==="suspended")return fail(403,"ACCOUNT_SUSPENDED","This account is suspended. Contact support.");
  const session=await createSession(row.id,env);const maxAge=Math.floor((new Date(session.expires).getTime()-Date.now())/1000);
  return json({data:{user:publicUser(row)}},200,{"Set-Cookie":cookie(session.token,maxAge)});
 }
 if(url.pathname==="/api/auth/forgot-password")return fail(503,"RECOVERY_NOT_CONFIGURED","Password recovery email delivery is not configured yet. Your account has not been changed.");
 return fail(404,"NOT_FOUND","Endpoint not found.");
}
export default {async fetch(request:Request,env:Env){let response:Response;try{response=await handle(request,env)}catch{response=fail(500,"INTERNAL_ERROR","Something went wrong. Please try again.");}const cors=corsHeaders(request,env);const headers=new Headers(response.headers);cors.forEach((v,k)=>headers.set(k,v));return secureHeaders(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));}};
