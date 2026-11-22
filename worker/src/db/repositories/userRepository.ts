import type { D1DatabaseLike } from "../connection";
export interface UserRecord {id:string;full_name:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";password_hash:string;password_salt:string;password_iterations:number;email_verified_at:string|null;created_at:string;updated_at:string;}
export async function findUserById(db:D1DatabaseLike,id:string):Promise<UserRecord|null>{return db.prepare("SELECT * FROM users WHERE id=? LIMIT 1").bind(id).first<UserRecord>();}
export async function findUserByEmail(db:D1DatabaseLike,email:string):Promise<UserRecord|null>{return db.prepare("SELECT * FROM users WHERE email=? COLLATE NOCASE LIMIT 1").bind(email.trim().toLowerCase()).first<UserRecord>();}
export async function createUser(db:D1DatabaseLike,input:{fullName:string;email:string;phone?:string|null;role:"customer"|"merchant";passwordHash:string;passwordSalt:string;passwordIterations:number;status?:"active"|"pending"}):Promise<string>{
 const fullName=input.fullName.trim(),email=input.email.trim().toLowerCase();if(fullName.length<2||fullName.length>100||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error("User name or email is invalid.");
 const id=crypto.randomUUID();await db.prepare("INSERT INTO users(id,full_name,email,phone,role,status,password_hash,password_salt,password_iterations) VALUES(?,?,?,?,?,?,?,?,?)").bind(id,fullName,email,input.phone?.trim()||null,input.role,input.status??"active",input.passwordHash,input.passwordSalt,input.passwordIterations).run();return id;
}
export async function updateUserStatus(db:D1DatabaseLike,id:string,status:UserRecord["status"]):Promise<boolean>{
 const result=await db.prepare("UPDATE users SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();return(result.meta.changes??0)>0;
}