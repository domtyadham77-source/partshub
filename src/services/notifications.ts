import { apiRequest } from "./api";
import type { AppNotification } from "../types/notification";
export const notificationsService={
 list:()=>apiRequest<{items:AppNotification[]}>("/notifications"),
 markRead:(id:string)=>apiRequest<{success:true}>(`/notifications/${encodeURIComponent(id)}/read`,{method:"POST",body:{}}),
 adminList:()=>apiRequest<{items:Array<AppNotification&{full_name:string;email:string}>}>("/admin/notifications"),
 send:(input:{userId:string;title:string;message:string;type:"info"|"success"|"warning"})=>apiRequest<{id:string;success:true}>("/admin/notifications",{method:"POST",body:input}),
};
