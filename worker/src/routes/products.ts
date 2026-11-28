import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
function publicProduct(row:any){return{id:row.id,name:row.name,category:row.category,fitment:row.fitment,sku:row.sku,description:row.description,pricePiasters:row.price_piasters,stockQuantity:row.stock_quantity,status:row.status,seller:"Parts Hub",offerCount:row.offer_count||1,imageUrl:row.image_id?"/api/images/"+row.image_id:null,createdAt:row.created_at};}
export function matchesProductsRoute(path:string,method:string){return (path==="/api/products"||path.startsWith("/api/products/"))&&method==="GET"||path==="/api/workshops"&&method==="GET";}
export async function handleProductsRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesProductsRoute(url.pathname,request.method))return null;
if(url.pathname==="/api/workshops"&&request.method==="GET"){
  const city=(url.searchParams.get("city")||"").trim().slice(0,80),type=url.searchParams.get("type")||"";const types=["garage","maintenance_center","motorcycle_workshop"];if(type&&!types.includes(type))return fail(400,"INVALID_WORKSHOP_TYPE","Choose a valid provider type.");
  let sql="SELECT m.id,m.store_name,m.description,m.contact_phone,m.business_type,m.city,m.area,m.address_line FROM merchant_profiles m JOIN users u ON u.id=m.user_id WHERE m.status='active' AND u.status='active' AND m.business_type IN ('garage','maintenance_center','motorcycle_workshop')";const values:string[]=[];if(city){sql+=" AND m.city LIKE ?";values.push("%"+city+"%");}if(type){sql+=" AND m.business_type=?";values.push(type);}sql+=" ORDER BY m.store_name ASC LIMIT 100";const rows=await env.DB.prepare(sql).bind(...values).all<any>();return json({data:{items:rows.results||[]}});
 }
 if(url.pathname==="/api/products"&&request.method==="GET"){
  const q=(url.searchParams.get("q")||"").trim().slice(0,80),category=url.searchParams.get("category")||"",limit=Math.min(48,Math.max(1,Number(url.searchParams.get("limit"))||24));
  if(category&&!["car_parts","motorcycle_parts","workshop"].includes(category))return fail(400,"INVALID_CATEGORY","Choose a valid product category.");
  let sql="SELECT p.*,m.store_name,pi.id AS image_id,(SELECT COUNT(*) FROM products p2 JOIN merchant_profiles m2 ON m2.id=p2.merchant_id JOIN users u2 ON u2.id=m2.user_id WHERE p2.status='active' AND m2.status='active' AND u2.status='active' AND p2.category=p.category AND lower(trim(p2.name))=lower(trim(p.name)) AND lower(trim(p2.fitment))=lower(trim(p.fitment))) AS offer_count FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id LEFT JOIN product_images pi ON pi.product_id=p.id WHERE p.status='active' AND m.status='active' AND u.status='active'";
  const values:(string|number)[]=[];if(category){sql+=" AND p.category=?";values.push(category);}if(q){sql+=" AND (p.name LIKE ? OR p.fitment LIKE ? OR p.sku LIKE ?)";values.push("%"+q+"%","%"+q+"%","%"+q+"%");}
  sql+=" ORDER BY p.created_at DESC LIMIT ?";values.push(limit);
  const result=await env.DB.prepare(sql).bind(...values).all<any>();return json({data:{items:(result.results||[]).map(publicProduct)}});
 }
 if(url.pathname.startsWith("/api/products/")&&request.method==="GET"){
  const id=url.pathname.slice("/api/products/".length);const row=await env.DB.prepare("SELECT p.*,m.store_name,pi.id AS image_id FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id LEFT JOIN product_images pi ON pi.product_id=p.id WHERE p.id=? AND p.status='active' AND m.status='active' AND u.status='active'").bind(id).first<any>();
  if(!row)return fail(404,"PRODUCT_NOT_FOUND","This product listing is unavailable.");
  const offers=await env.DB.prepare("SELECT p.id,p.price_piasters,p.stock_quantity FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id WHERE p.status='active' AND m.status='active' AND u.status='active' AND p.category=? AND lower(trim(p.name))=lower(trim(?)) AND lower(trim(p.fitment))=lower(trim(?)) ORDER BY p.price_piasters ASC").bind(row.category,row.name,row.fitment).all<any>();
  const offerRows=offers.results||[];
  return json({data:{product:{...publicProduct({...row,offer_count:offerRows.length}),offers:offerRows.map((offer:any)=>({id:offer.id,pricePiasters:offer.price_piasters,stockQuantity:offer.stock_quantity}))}}});
 }
 
return null;}
