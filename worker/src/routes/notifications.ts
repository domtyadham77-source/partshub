import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function createNotification(env:Env,userId:string,title:string,message:string){try{await env.DB.prepare("INSERT INTO notifications(id,user_id,title,message,type) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),userId,title,message,"info").run();}catch{/* Do not block order placement for notification failure. */}}
export function matchesNotificationsRoute(path:string,method:string){return (path==="/api/notifications"&&method==="GET")||(path.startsWith("/api/notifications/")&&method==="POST");}
export async function handleNotificationsRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesNotificationsRoute(url.pathname,request.method))return null;
if(url.pathname==="/api/notifications"&&request.method==="GET"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to view notifications.");
  const rows=await env.DB.prepare("SELECT id,title,message,type,read_at,created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(user.id).all<any>();return json({data:{items:rows.results||[]}});
 }
 if(url.pathname.startsWith("/api/notifications/")&&request.method==="POST"){
  const user=await readUser(request,env);if(!user)return fail(401,"UNAUTHENTICATED","Sign in to continue.");
  const id=url.pathname.slice("/api/notifications/".length).replace(/\/read$/,"");
  const result=await env.DB.prepare("UPDATE notifications SET read_at=? WHERE id=? AND user_id=?").bind(new Date().toISOString(),id,user.id).run();return result.meta.changes?json({data:{success:true}}):fail(404,"NOTIFICATION_NOT_FOUND","Notification was not found.");
 }
 
return null;}
