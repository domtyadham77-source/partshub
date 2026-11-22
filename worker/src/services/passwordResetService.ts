import type { D1DatabaseLike } from "../db/connection";
const ALPHABET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function randomToken():string{
 let token="";
 while(token.length<12){const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);for(const byte of bytes){if(byte<248){token+=ALPHABET[byte%62];if(token.length===12)break;}}}
 return token;
}
async function digest(value:string):Promise<string>{const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");}
/** Returns the 12-character token once. Deliver only through a verified private recovery channel. */
export async function issuePasswordResetToken(db:D1DatabaseLike,userId:string):Promise<{token:string;expiresAt:string}>{
 const token=randomToken(),tokenHash=await digest(token),expiresAt=new Date(Date.now()+10*60_000).toISOString(),id=crypto.randomUUID(),now=new Date().toISOString();
 await db.batch([
  db.prepare("UPDATE password_reset_tokens SET consumed_at=? WHERE user_id=? AND consumed_at IS NULL").bind(now,userId),
  db.prepare("INSERT INTO password_reset_tokens(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(id,userId,tokenHash,expiresAt)
 ]);
 return{token,expiresAt};
}
export async function consumePasswordResetToken(db:D1DatabaseLike,token:string):Promise<string|null>{
 if(!/^[A-Za-z0-9]{12}$/.test(token))return null;const now=new Date().toISOString(),tokenHash=await digest(token);
 const row=await db.prepare("SELECT id,user_id FROM password_reset_tokens WHERE token_hash=? AND consumed_at IS NULL AND expires_at>? LIMIT 1").bind(tokenHash,now).first<{id:string;user_id:string}>();
 if(!row)return null;
 const result=await db.prepare("UPDATE password_reset_tokens SET consumed_at=? WHERE id=? AND consumed_at IS NULL AND expires_at>?").bind(now,row.id,now).run();
 return(result.meta.changes??0)===1?row.user_id:null;
}