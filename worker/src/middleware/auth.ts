import type { D1DatabaseLike } from "../db/connection";
export interface AuthUser {id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";}
export interface AuthEnv {DB:D1DatabaseLike;}
function readCookie(request:Request,name:string):string|null{
 const raw=request.headers.get("Cookie");if(!raw)return null;
 for(const part of raw.split(";")){const i=part.indexOf("=");if(i<0)continue;if(part.slice(0,i).trim()===name)return decodeURIComponent(part.slice(i+1).trim());}
 return null;
}
async function sha256(value:string):Promise<string>{const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");}
export async function authenticateRequest(request:Request,env:AuthEnv):Promise<AuthUser|null>{
 const token=readCookie(request,"ph_session");if(!token||token.length>256)return null;
 const row=await env.DB.prepare("SELECT u.id,u.full_name,u.email,u.phone,u.role,u.status FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended' LIMIT 1").bind(await sha256(token),new Date().toISOString()).first<any>();
 return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status}:null;
}
export function unauthorizedResponse():Response{return Response.json({error:{code:"UNAUTHENTICATED",message:"Sign in to continue."}},{status:401,headers:{"Cache-Control":"no-store"}});}