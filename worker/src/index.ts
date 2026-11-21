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
async function readUser(request:Request,env:Env){const token=cookieValue(request,"ph_session");if(!token)return null;const hash=await digest(token);const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(hash,new Date().toISOString()).first<any>();return row?publicUser(row):null;}
async function createSession(userId:string,env:Env){const token=randomToken();const days=Math.min(30,Math.max(1,Number(env.SESSION_TTL_DAYS)||14));const expires=new Date(Date.now()+days*86400000).toISOString();await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),userId,await digest(token),expires).run();return {token,expires};}
function cookie(token:string,maxAge:number){return `ph_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;}
function clearCookie(){return "ph_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";}
async function handle(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders(request,env)});
 if(url.pathname==="/api/health")return json({data:{ok:true,service:"parts-hub-api"}});
 if(!url.pathname.startsWith("/api/auth/"))return fail(404,"NOT_FOUND","Endpoint not found.");
 const origin=request.headers.get("Origin");const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(x=>x.trim()).filter(Boolean);if(origin&&origin!==url.origin&&!allowed.includes(origin))return fail(403,"ORIGIN_NOT_ALLOWED","This origin is not allowed.");
 if(request.method==="GET"&&url.pathname==="/api/auth/me"){const user=await readUser(request,env);return json({data:{user}});}
 if(request.method==="POST"&&url.pathname==="/api/auth/logout"){const token=cookieValue(request,"ph_session");if(token)await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();return json({data:{success:true}},200,{"Set-Cookie":clearCookie()});}
 if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED","Method not allowed.");
 let body:any;try{body=await request.json()}catch{return fail(400,"INVALID_JSON","Request body must be valid JSON.");}
 if(url.pathname==="/api/auth/register"){
  const fullName=String(body.fullName||"").trim(),email=String(body.email||"").trim().toLowerCase(),phone=String(body.phone||"").trim()||null,password=String(body.password||""),role=body.role==="merchant"?"merchant":"customer";
  if(fullName.length<2||fullName.length>90)return fail(422,"INVALID_NAME","Enter your full name.");
  if(!validEmail(email))return fail(422,"INVALID_EMAIL","Enter a valid email address.");
  if(phone&&phone.length>30)return fail(422,"INVALID_PHONE","Enter a valid phone number.");
  if(password.length<10||password.length>128)return fail(422,"WEAK_PASSWORD","Password must be at least 10 characters.");
  const existing=await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();if(existing)return fail(409,"EMAIL_EXISTS","An account with this email already exists.");
  const id=crypto.randomUUID(),salt=randomToken(16),hash=await passwordHash(password,salt);
  try{await env.DB.prepare("INSERT INTO users(id,full_name,email,phone,role,status,password_hash,password_salt) VALUES(?,?,?,?,?,?,?,?)").bind(id,fullName,email,phone,role,role==="merchant"?"pending":"active",hash,salt).run();}catch{return fail(409,"EMAIL_EXISTS","An account with this email already exists.");}
  const session=await createSession(id,env);const row=await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(id).first<any>();const maxAge=Math.floor((new Date(session.expires).getTime()-Date.now())/1000);
  return json({data:{user:publicUser(row)}},201,{"Set-Cookie":cookie(session.token,maxAge)});
 }
 if(url.pathname==="/api/auth/login"){
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
