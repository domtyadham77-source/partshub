import type { D1DatabaseLike } from "../connection";
export interface NotificationRow {id:string;user_id:string;created_by:string|null;title:string;message:string;type:"info"|"success"|"warning";read_at:string|null;created_at:string;}
export async function createNotification(db:D1DatabaseLike,input:{userId:string;createdBy?:string|null;title:string;message:string;type?:"info"|"success"|"warning"}):Promise<string>{
  const title=input.title.trim(),message=input.message.trim();
  if(!title||title.length>160||!message||message.length>2000)throw new Error("Invalid notification content.");
  const id=crypto.randomUUID();
  await db.prepare("INSERT INTO notifications(id,user_id,created_by,title,message,type) VALUES(?,?,?,?,?,?)").bind(id,input.userId,input.createdBy??null,title,message,input.type??"info").run();
  return id;
}
export async function listNotifications(db:D1DatabaseLike,userId:string,limit=50):Promise<NotificationRow[]>{
  const rows=await db.prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT ?").bind(userId,Math.min(100,Math.max(1,Math.trunc(limit)))).all<NotificationRow>();
  return rows.results??[];
}
export async function markNotificationRead(db:D1DatabaseLike,userId:string,id:string):Promise<boolean>{
  const result=await db.prepare("UPDATE notifications SET read_at=COALESCE(read_at,?) WHERE id=? AND user_id=?").bind(new Date().toISOString(),id,userId).run();
  return (result.meta.changes??0)>0;
}