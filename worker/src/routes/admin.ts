import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
type MerchantRow={id:string;user_id:string;store_name:string;description:string;contact_phone:string|null;status:string;business_type:string;city:string;area:string;address_line:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
function publicProduct(row:any){return{id:row.id,name:row.name,category:row.category,fitment:row.fitment,sku:row.sku,description:row.description,pricePiasters:row.price_piasters,stockQuantity:row.stock_quantity,status:row.status,seller:row.store_name,imageUrl:row.image_id?"/api/images/"+row.image_id:null,createdAt:row.created_at};}
async function createNotification(env:Env,userId:string,title:string,message:string,type:"info"|"success"|"warning"="info",createdBy:string|null=null){try{await env.DB.prepare("INSERT INTO notifications(id,user_id,created_by,title,message,type) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(),userId,createdBy,title,message,type).run();}catch{/* Notification failures must not block the primary action. */}}
export function matchesAdminRoute(path:string,method:string){return path.startsWith("/api/admin/")&&(method==="GET"||method==="POST");}
export async function handleAdminRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesAdminRoute(url.pathname,request.method))return null;
if(url.pathname.startsWith("/api/admin/")){
  const merchantParts=url.pathname.split("/").filter(Boolean);
  const admin=await readUser(request,env);if(!admin)return fail(401,"UNAUTHENTICATED","Sign in to continue.");if(admin.role!=="admin"||admin.status!=="active")return fail(403,"ADMIN_ONLY","Administrator access is required.");
  if(url.pathname==="/api/admin/overview"&&request.method==="GET"){
   const [users,merchants,products]=await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total FROM users").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM merchant_profiles WHERE status='pending'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM products").first<any>()
   ]);
   return json({data:{users:users?.total||0,pendingMerchants:merchants?.total||0,products:products?.total||0}});
  }

  if(url.pathname==="/api/admin/users"&&request.method==="GET"){
   const q=(url.searchParams.get("q")||"").trim().slice(0,80),role=url.searchParams.get("role")||"";
   let sql="SELECT id,full_name,email,phone,role,status,created_at FROM users WHERE 1=1";const values:string[]=[];
   if(role&&["customer","merchant","admin"].includes(role)){sql+=" AND role=?";values.push(role);}
   if(q){sql+=" AND (full_name LIKE ? OR email LIKE ?)";values.push("%"+q+"%","%"+q+"%");}
   sql+=" ORDER BY created_at DESC LIMIT 100";const result=await env.DB.prepare(sql).bind(...values).all<any>();return json({data:{items:result.results||[]}});
  }
  if(url.pathname==="/api/admin/orders"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"";let sql="SELECT o.*,u.full_name AS customer_name,m.store_name FROM orders o JOIN users u ON u.id=o.customer_id JOIN merchant_profiles m ON m.id=o.merchant_id";const values:string[]=[];
   if(status&&["pending","accepted","rejected","processing","shipped","delivered","cancelled"].includes(status)){sql+=" WHERE o.status=?";values.push(status);}
   sql+=" ORDER BY o.created_at DESC LIMIT 100";const result=await env.DB.prepare(sql).bind(...values).all<any>();return json({data:{items:result.results||[]}});
  }
  if(merchantParts.length===4&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="users"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||"");if(!["active","suspended"].includes(status))return fail(422,"INVALID_STATUS","Choose active or suspended.");
   const target=await env.DB.prepare("SELECT id,role FROM users WHERE id=?").bind(id).first<any>();if(!target)return fail(404,"USER_NOT_FOUND","User was not found.");
   if(target.role==="admin"||id===admin.id)return fail(403,"ADMIN_PROTECTED","Administrator accounts cannot be changed here.");
   if(status==="active"&&target.role==="merchant")return fail(409,"MERCHANT_REVIEW_REQUIRED","Merchant reactivation must be reviewed through merchant applications.");
   await env.DB.prepare("UPDATE users SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();
   if(status==="suspended"&&target.role==="merchant")await env.DB.prepare("UPDATE merchant_profiles SET status='suspended',updated_at=? WHERE user_id=?").bind(new Date().toISOString(),id).run();
   return json({data:{success:true,status}});
  }


  if(url.pathname==="/api/admin/reports"&&request.method==="GET"){
   const [orders,paid,pending,delivered,merchants,tickets]=await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total,COALESCE(SUM(total_piasters),0) AS gross FROM orders").first<any>(),
    env.DB.prepare("SELECT COALESCE(SUM(total_piasters),0) AS total FROM orders WHERE payment_status='paid'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM orders WHERE status='pending'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM orders WHERE status='delivered'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM merchant_profiles WHERE status='active'").first<any>(),
    env.DB.prepare("SELECT COUNT(*) AS total FROM support_tickets WHERE status IN ('open','in_progress')").first<any>()
   ]);
   return json({data:{orderCount:orders?.total||0,grossOrderValuePiasters:orders?.gross||0,paidOrderValuePiasters:paid?.total||0,pendingOrders:pending?.total||0,deliveredOrders:delivered?.total||0,activeMerchants:merchants?.total||0,openSupportTickets:tickets?.total||0}});
  }
  if(url.pathname==="/api/admin/notifications"&&request.method==="POST"){
   let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const userId=String(body.userId||""),title=String(body.title||"").trim(),message=String(body.message||"").trim(),type=String(body.type||"info");
   if(!userId||title.length<2||title.length>100||message.length<3||message.length>1000||!["info","success","warning"].includes(type))return fail(422,"INVALID_NOTIFICATION","Check the recipient, title, message, and type.");
   const target=await env.DB.prepare("SELECT id FROM users WHERE id=? AND status='active'").bind(userId).first();if(!target)return fail(404,"USER_NOT_FOUND","Active user was not found.");
   const id=crypto.randomUUID();await env.DB.prepare("INSERT INTO notifications(id,user_id,created_by,title,message,type) VALUES(?,?,?,?,?,?)").bind(id,userId,admin.id,title,message,type).run();return json({data:{id,success:true}},201);
  }
  if(url.pathname==="/api/admin/notifications"&&request.method==="GET"){
   const rows=await env.DB.prepare("SELECT n.id,n.title,n.message,n.type,n.created_at,u.full_name,u.email FROM notifications n JOIN users u ON u.id=n.user_id ORDER BY n.created_at DESC LIMIT 100").all<any>();return json({data:{items:rows.results||[]}});
  }
  if(url.pathname==="/api/admin/support"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"open";if(!["open","in_progress","resolved","closed"].includes(status))return fail(400,"INVALID_STATUS","Choose a valid ticket status.");
   const result=await env.DB.prepare("SELECT t.*,u.full_name,u.email FROM support_tickets t JOIN users u ON u.id=t.user_id WHERE t.status=? ORDER BY t.created_at ASC LIMIT 100").bind(status).all<any>();return json({data:{items:result.results||[]}});
  }
  if(merchantParts.length===4&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="support"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||""),note=String(body.adminNote||"").trim();if(!["in_progress","resolved","closed"].includes(status)||note.length>1000)return fail(422,"INVALID_TICKET_UPDATE","Choose a valid status and a note up to 1,000 characters.");
   const ticket=await env.DB.prepare("SELECT user_id,ticket_number FROM support_tickets WHERE id=?").bind(id).first<any>();if(!ticket)return fail(404,"TICKET_NOT_FOUND","Support ticket was not found.");const result=await env.DB.prepare("UPDATE support_tickets SET status=?,admin_note=?,updated_at=? WHERE id=?").bind(status,note,new Date().toISOString(),id).run();if(!result.meta.changes)return fail(404,"TICKET_NOT_FOUND","Support ticket was not found.");await createNotification(env,ticket.user_id,"Support request updated",`Your support request ${ticket.ticket_number} is now ${status.replace("_"," ")}.`,status==="resolved"?"success":"info",admin.id);return json({data:{success:true,status}});
  }
  if(url.pathname==="/api/admin/products"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"draft";if(!["draft","active","archived"].includes(status))return fail(400,"INVALID_STATUS","Choose a valid product status.");
   const result=await env.DB.prepare("SELECT p.*,m.store_name,(SELECT id FROM product_images WHERE product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_id FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id WHERE p.status=? ORDER BY p.created_at ASC LIMIT 100").bind(status).all<any>();
   return json({data:{items:(result.results||[]).map(publicProduct)}});
  }
  if(url.pathname==="/api/admin/merchants"&&request.method==="GET"){
   const status=url.searchParams.get("status")||"pending";if(!["pending","active","rejected","suspended"].includes(status))return fail(400,"INVALID_STATUS","Choose a valid merchant status.");
   const result=await env.DB.prepare("SELECT m.id,m.store_name,m.description,m.contact_phone,m.business_type,m.city,m.area,m.status,m.created_at,u.full_name,u.email FROM merchant_profiles m JOIN users u ON u.id=m.user_id WHERE m.status=? ORDER BY m.created_at ASC LIMIT 100").bind(status).all<any>();
   return json({data:{items:result.results||[]}});
  }
  if(merchantParts.length===5&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="merchants"&&merchantParts[4]==="status"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||"");if(!["active","rejected","suspended"].includes(status))return fail(422,"INVALID_STATUS","Choose active, rejected, or suspended.");
   const result=await env.DB.prepare("UPDATE merchant_profiles SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();
   if(!result.meta.changes)return fail(404,"MERCHANT_NOT_FOUND","Merchant profile was not found.");
   if(status==="active"||status==="rejected")await env.DB.prepare("UPDATE users SET status='active',updated_at=? WHERE id=(SELECT user_id FROM merchant_profiles WHERE id=?)").bind(new Date().toISOString(),id).run();if(status==="suspended")await env.DB.prepare("UPDATE users SET status='suspended',updated_at=? WHERE id=(SELECT user_id FROM merchant_profiles WHERE id=?)").bind(new Date().toISOString(),id).run();
   const owner=await env.DB.prepare("SELECT user_id FROM merchant_profiles WHERE id=?").bind(id).first<any>();if(owner)await createNotification(env,owner.user_id,"Seller application reviewed",status==="active"?"Your seller account has been approved. You can now manage your store.":status==="rejected"?"Your seller application was not approved. Contact support if you need help.":"Seller access has been suspended.",status==="active"?"success":"warning",admin.id);
   return json({data:{success:true,status}});
  }
  if(merchantParts.length===5&&merchantParts[0]==="api"&&merchantParts[1]==="admin"&&merchantParts[2]==="products"&&merchantParts[4]==="status"&&request.method==="POST"){
   const id=merchantParts[3];let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const status=String(body.status||"");if(!["active","archived"].includes(status))return fail(422,"INVALID_STATUS","Choose active or archived.");
   const product=await env.DB.prepare("SELECT p.id,m.user_id AS merchant_user_id,m.status AS merchant_status,u.status AS user_status FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.id=?").bind(id).first<any>();
   if(!product)return fail(404,"PRODUCT_NOT_FOUND","Product listing was not found.");
   if(status==="active"&&(product.merchant_status!=="active"||product.user_status!=="active"))return fail(409,"MERCHANT_NOT_APPROVED","Approve the merchant before activating product listings.");
   await env.DB.prepare("UPDATE products SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();await createNotification(env,product.merchant_user_id,"Product listing reviewed",status==="active"?"Your product listing is now visible in the marketplace.":"Your product listing was archived by marketplace moderation.",status==="active"?"success":"warning",admin.id);return json({data:{success:true,status}});
  }
  return fail(404,"NOT_FOUND","Admin endpoint not found.");
 }
 
return null;}
