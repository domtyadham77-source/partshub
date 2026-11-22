import type { D1DatabaseLike } from "../db/connection";
export interface SessionEnv {SESSION_TTL_DAYS?:string;}
function randomHex(bytes=32):string{const data=new Uint8Array(bytes);crypto.getRandomValues(data);return Array.from(data,b=>b.toString(16).padStart(2,"0")).join("");}
async function digest(value:string):Promise<string>{const data=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(data),b=>b.toString(16).padStart(2,"0")).join("");}
export async function createSession(db:D1DatabaseLike,userId:string,env:SessionEnv={}):Promise<{token:string;expiresAt:string}>{
 const days=Math.min(30,Math.max(1,Number(env.SESSION_TTL_DAYS)||14)),token=randomHex(),expiresAt=new Date(Date.now()+days*86400000).toISOString();
 await db.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),userId,await digest(token),expiresAt).run();
 return{token,expiresAt};
}
export async function revokeSession(db:D1DatabaseLike,token:string):Promise<void>{if(!token||token.length>256)return;await db.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();}
export async function revokeAllUserSessions(db:D1DatabaseLike,userId:string):Promise<void>{await db.prepare("DELETE FROM sessions WHERE user_id=?").bind(userId).run();}
export function sessionCookie(token:string,maxAgeSeconds:number):string{return `ph_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${Math.max(0,Math.trunc(maxAgeSeconds))}`;}
export const expiredSessionCookie="ph_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";