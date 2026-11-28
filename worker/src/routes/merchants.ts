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
async function merchantFor(request:Request,env:Env,allowPending=false){const user=await readUser(request,env);if(!user)return{error:fail(401,"UNAUTHENTICATED","Sign in to continue.")};if(user.role!=="merchant")return{error:fail(403,"MERCHANT_ONLY","A merchant account is required.")};const merchant=await env.DB.prepare("SELECT * FROM merchant_profiles WHERE user_id=?").bind(user.id).first<MerchantRow>();if(!merchant)return{error:fail(404,"MERCHANT_PROFILE_MISSING","Merchant profile was not found.")};if(merchant.status!=="active"&&!allowPending)return{error:fail(403,"MERCHANT_NOT_APPROVED","Your seller account must be approved before managing listings.")};return{user,merchant};}
export function matchesMerchantRoute(path:string,method:string){return path.startsWith("/api/merchant/")&&(method==="GET"||method==="POST"||method==="PATCH"||method==="DELETE");}
export async function handleMerchantRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesMerchantRoute(url.pathname,request.method))return null;
if(url.pathname.startsWith("/api/merchant/")){
  const isProfile=url.pathname==="/api/merchant/profile";
  const context=await merchantFor(request,env,isProfile&&(request.method==="GET"||request.method==="PATCH"));
  if(context.error)return context.error;
  const merchant=context.merchant;
  if(isProfile&&request.method==="GET")return json({data:{merchant:{id:merchant.id,storeName:merchant.store_name,description:merchant.description,contactPhone:merchant.contact_phone,status:merchant.status,businessType:merchant.business_type,city:merchant.city,area:merchant.area,addressLine:merchant.address_line}}});
  if(isProfile&&request.method==="PATCH"){
   let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
   const storeName=String(body.storeName??merchant.store_name).trim(),description=String(body.description??merchant.description).trim(),phone=String(body.contactPhone??merchant.contact_phone??"").trim()||null,businessType=String(body.businessType??merchant.business_type),city=String(body.city??merchant.city).trim(),area=String(body.area??merchant.area).trim(),addressLine=String(body.addressLine??merchant.address_line).trim();
   if(storeName.length<2||storeName.length>100||description.length>1000||(phone&&phone.length>30)||!["parts_store","garage","maintenance_center","motorcycle_workshop"].includes(businessType)||city.length>80||area.length>100||addressLine.length>250)return fail(422,"INVALID_PROFILE","Check your store name, business type, description, and address.");
   await env.DB.prepare("UPDATE merchant_profiles SET store_name=?,description=?,contact_phone=?,business_type=?,city=?,area=?,address_line=?,updated_at=? WHERE id=?").bind(storeName,description,phone,businessType,city,area,addressLine,new Date().toISOString(),merchant.id).run();
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
    for(const item of items.results||[]){const result=await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity-?,updated_at=? WHERE id=? AND stock_quantity>=? AND status='active'").bind(item.quantity,new Date().toISOString(),item.product_id,item.quantity).run();if(!result.meta.changes){for(const previous of reservedItems)await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity+? WHERE id=?").bind(previous.quantity,previous.id).run();return fail(409,"INSUFFICIENT_STOCK","Stock changed before this order could be accepted.");}reservedItems.push({id:item.product_id,quantity:item.quantity});}
   }
   const result=await env.DB.prepare("UPDATE orders SET status=?,updated_at=? WHERE id=? AND merchant_id=? AND status=?").bind(next,new Date().toISOString(),orderId,merchant.id,order.status).run();
   if(!result.meta.changes){for(const reserved of reservedItems)await env.DB.prepare("UPDATE products SET stock_quantity=stock_quantity+? WHERE id=?").bind(reserved.quantity,reserved.id).run();return fail(409,"ORDER_UPDATED","This order was updated by another request. Refresh and try again.");}
   await createNotification(env,order.customer_id,"Order status updated",`Your order ${order.order_number} is now ${next.replace("_"," ")}.`,next==="rejected"?"warning":"success",merchant.user_id);return json({data:{success:true,status:next}});
  }

  const imageSegments=url.pathname.split("/").filter(Boolean);
  if(imageSegments.length===5&&imageSegments[0]==="api"&&imageSegments[1]==="merchant"&&imageSegments[2]==="products"&&imageSegments[4]==="image"&&request.method==="POST"){
   const productId=imageSegments[3],owned=await env.DB.prepare("SELECT id FROM products WHERE id=? AND merchant_id=?").bind(productId,merchant.id).first();if(!owned)return fail(404,"PRODUCT_NOT_FOUND","Product listing was not found.");
   let form:FormData;try{form=await request.formData()}catch{return fail(400,"INVALID_FORM","Upload a valid image file.");}
   const file=form.get("image");if(!(file instanceof File))return fail(422,"IMAGE_REQUIRED","Choose an image to upload.");
   if(!["image/jpeg","image/png","image/webp"].includes(file.type))return fail(422,"INVALID_IMAGE_TYPE","Only JPG, PNG, and WebP images are supported.");
   if(file.size<1||file.size>1000000)return fail(413,"IMAGE_TOO_LARGE","Edited images must be 1 MB or smaller.");
   const id=crypto.randomUUID(),bytes=new Uint8Array(await file.arrayBuffer());
   const order=await env.DB.prepare("SELECT COALESCE(MAX(sort_order),-1)+1 AS next FROM product_images WHERE product_id=?").bind(productId).first<any>();
   await env.DB.prepare("INSERT INTO product_images(id,product_id,content_type,byte_size,image_data,sort_order) VALUES(?,?,?,?,?,?)").bind(id,productId,file.type,file.size,bytes,Number(order?.next)||0).run();
   return json({data:{imageUrl:"/api/images/"+id}},201);
  }
  if(url.pathname==="/api/merchant/products"&&request.method==="GET"){
   const rows=await env.DB.prepare("SELECT p.*,m.store_name,(SELECT id FROM product_images WHERE product_id=p.id ORDER BY sort_order,id LIMIT 1) AS image_id FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id WHERE p.merchant_id=? ORDER BY p.created_at DESC LIMIT 100").bind(merchant.id).all<any>();
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
 
return null;}
