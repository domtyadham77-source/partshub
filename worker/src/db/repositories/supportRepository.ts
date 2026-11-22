import type { D1DatabaseLike } from "../connection";
export interface SupportTicket {id:string;ticket_number:string;user_id:string;category:"order"|"account"|"payment"|"delivery"|"product"|"other";subject:string;message:string;status:"open"|"in_progress"|"resolved"|"closed";admin_note:string;created_at:string;updated_at:string;}
export async function createSupportTicket(db:D1DatabaseLike,input:{userId:string;category:SupportTicket["category"];subject:string;message:string}):Promise<{id:string;ticketNumber:string}>{
 const subject=input.subject.trim(),message=input.message.trim();if(subject.length<5||subject.length>120||message.length<10||message.length>3000)throw new Error("Support ticket content is invalid.");
 const id=crypto.randomUUID(),ticketNumber="SUP"+Date.now().toString(36).toUpperCase()+crypto.randomUUID().slice(0,6).toUpperCase();
 await db.prepare("INSERT INTO support_tickets(id,ticket_number,user_id,category,subject,message) VALUES(?,?,?,?,?,?)").bind(id,ticketNumber,input.userId,input.category,subject,message).run();return{id,ticketNumber};
}
export async function listUserTickets(db:D1DatabaseLike,userId:string,limit=50):Promise<SupportTicket[]>{
 const rows=await db.prepare("SELECT * FROM support_tickets WHERE user_id=? ORDER BY created_at DESC LIMIT ?").bind(userId,Math.min(100,Math.max(1,Math.trunc(limit)))).all<SupportTicket>();return rows.results??[];
}
export async function updateTicketStatus(db:D1DatabaseLike,id:string,status:SupportTicket["status"],adminNote=""):Promise<boolean>{
 const result=await db.prepare("UPDATE support_tickets SET status=?,admin_note=?,updated_at=? WHERE id=?").bind(status,adminNote.trim().slice(0,3000),new Date().toISOString(),id).run();return(result.meta.changes??0)>0;
}