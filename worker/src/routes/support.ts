import type { Env } from "../index";
type User={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function cookieValue(request:Request){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("ph_session="))?.slice(11)||null;}
async function digest(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function readUser(request:Request,env:Env):Promise<User|null>{const token=cookieValue(request);if(!token)return null;const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(await digest(token),new Date().toISOString()).first<any>();return row?{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at}:null;}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function createNotification(env:Env,userId:string,title:string,message:string){try{await env.DB.prepare("INSERT INTO notifications(id,user_id,title,message,type) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),userId,title,message,"info").run();}catch{/* Do not block order placement for notification failure. */}}
export function matchesSupportRoute(path:string,method:string){return path==="/api/support/tickets"&&(method==="GET"||method==="POST");}
export async function handleSupportRoute(request:Request,env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesSupportRoute(url.pathname,request.method))return null;
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
 
return null;}
