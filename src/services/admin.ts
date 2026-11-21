import { apiRequest } from "./api";
export type AdminMerchant={id:string;store_name:string;description:string;contact_phone:string|null;status:string;created_at:string;full_name:string;email:string};
export const adminService={
 overview:()=>apiRequest<{users:number;pendingMerchants:number;products:number}>("/admin/overview"),
 merchants:(status="pending")=>apiRequest<{items:AdminMerchant[]}>(`/admin/merchants?status=${encodeURIComponent(status)}`),
 setMerchantStatus:(id:string,status:"active"|"rejected"|"suspended")=>apiRequest<{success:true;status:string}>(`/admin/merchants/${encodeURIComponent(id)}/status`,{method:"POST",body:{status}}),
};
