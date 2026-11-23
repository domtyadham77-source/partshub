import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
export function matchesUploadsRoute(path:string,method:string){return path.startsWith("/api/images/")&&method==="GET";}
export async function handleUploadsRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesUploadsRoute(url.pathname,request.method))return null;
if(url.pathname.startsWith("/api/images/")&&request.method==="GET"){
  const imageId=url.pathname.slice("/api/images/".length);const row=await env.DB.prepare("SELECT pi.image_data,pi.content_type,p.status AS product_status,m.status AS merchant_status,m.user_id FROM product_images pi JOIN products p ON p.id=pi.product_id JOIN merchant_profiles m ON m.id=p.merchant_id WHERE pi.id=?").bind(imageId).first<any>();
  if(!row)return fail(404,"IMAGE_NOT_FOUND","Image was not found.");
  const isPublic=row.product_status==="active"&&row.merchant_status==="active";let allowed=isPublic;if(!allowed){const user=await readUser(request,env);allowed=!!user&&user.role==="merchant"&&user.id===row.user_id;}
  if(!allowed)return fail(404,"IMAGE_NOT_FOUND","Image was not found.");
  return new Response(row.image_data,{status:200,headers:{"Content-Type":row.content_type,"Cache-Control":isPublic?"public, max-age=3600":"private, no-store","X-Content-Type-Options":"nosniff"}});
 }
 
return null;}
