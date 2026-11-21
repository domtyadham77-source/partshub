import { apiRequest } from "./api";
export type SupportTicket={id:string;ticket_number:string;category:string;subject:string;message:string;status:string;admin_note:string;created_at:string;updated_at:string;full_name?:string;email?:string};
export const supportService={
 list:()=>apiRequest<{items:SupportTicket[]}>("/support/tickets"),
 create:(input:{category:string;subject:string;message:string})=>apiRequest<{id:string;ticketNumber:string;status:string}>("/support/tickets",{method:"POST",body:input}),
 adminList:(status="open")=>apiRequest<{items:SupportTicket[]}>(`/admin/support?status=${encodeURIComponent(status)}`),
 update:(id:string,status:"in_progress"|"resolved"|"closed",adminNote:string)=>apiRequest<{success:true;status:string}>(`/admin/support/${encodeURIComponent(id)}`,{method:"POST",body:{status,adminNote}}),
};
