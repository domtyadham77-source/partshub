import type { D1DatabaseLike } from "../db/connection";
async function hash(value:string):Promise<string>{const data=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,"0")).join("");}
export async function checkRateLimit(db:D1DatabaseLike,request:Request,scope:string,options:{limit?:number;windowSeconds?:number}={}):Promise<{allowed:boolean;remaining:number;retryAfterSeconds:number}>{
 const limit=Math.max(1,Math.min(100,Math.trunc(options.limit??10))),windowSeconds=Math.max(1,Math.min(86400,Math.trunc(options.windowSeconds??900)));
 const ip=request.headers.get("CF-Connecting-IP")??"unknown",key=await hash(scope+":"+ip),since=new Date(Date.now()-windowSeconds*1000).toISOString();
 const row=await db.prepare("SELECT COUNT(*) AS total,MIN(created_at) AS oldest FROM auth_attempts WHERE key_hash=? AND created_at>?").bind(key,since).first<{total:number;oldest:string|null}>();
 const total=Number(row?.total??0);if(total>=limit){const retry=row?.oldest?Math.max(1,Math.ceil((new Date(row.oldest).getTime()+windowSeconds*1000-Date.now())/1000)):windowSeconds;return{allowed:false,remaining:0,retryAfterSeconds:retry};}
 await db.prepare("INSERT INTO auth_attempts(id,key_hash) VALUES(?,?)").bind(crypto.randomUUID(),key).run();
 return{allowed:true,remaining:Math.max(0,limit-total-1),retryAfterSeconds:0};
}
export function rateLimitResponse(retryAfterSeconds:number):Response{return Response.json({error:{code:"RATE_LIMITED",message:"Too many attempts. Try again later."}},{status:429,headers:{"Retry-After":String(retryAfterSeconds),"Cache-Control":"no-store"}});}