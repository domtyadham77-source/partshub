import { apiRequest } from "./api";
export type AdminMerchant={id:string;store_name:string;description:string;contact_phone:string|null;business_type:string;city:string;area:string;status:string;created_at:string;full_name:string;email:string};
export const adminService={
 overview:()=>apiRequest<{users:number;pendingMerchants:number;products:number}>("/admin/overview"),
 reports:()=>apiRequest<{orderCount:number;grossOrderValuePiasters:number;paidOrderValuePiasters:number;pendingOrders:number;deliveredOrders:number;activeMerchants:number;openSupportTickets:number}>("/admin/reports"),
 merchants:(status="pending")=>apiRequest<{items:AdminMerchant[]}>(`/admin/merchants?status=${encodeURIComponent(status)}`),
 setMerchantStatus:(id:string,status:"active"|"rejected"|"suspended")=>apiRequest<{success:true;status:string}>(`/admin/merchants/${encodeURIComponent(id)}/status`,{method:"POST",body:{status}}),
 products:(status="draft")=>apiRequest<{items:Array<{id:string;name:string;category:string;fitment:string;description:string;pricePiasters:number;stockQuantity:number;seller:string}>}>(`/admin/products?status=${encodeURIComponent(status)}`),
 setProductStatus:(id:string,status:"active"|"archived")=>apiRequest<{success:true;status:string}>(`/admin/products/${encodeURIComponent(id)}/status`,{method:"POST",body:{status}}),
 users:(q="")=>apiRequest<{items:Array<{id:string;full_name:string;email:string;phone:string|null;role:string;status:string;created_at:string}>}>(`/admin/users?q=${encodeURIComponent(q)}`),
 setUserStatus:(id:string,status:"active"|"suspended")=>apiRequest<{success:true;status:string}>(`/admin/users/${encodeURIComponent(id)}`,{method:"POST",body:{status}}),
 orders:(status="")=>apiRequest<{items:Array<{id:string;order_number:string;status:string;total_piasters:number;created_at:string;customer_name:string;store_name:string}>}>(`/admin/orders?status=${encodeURIComponent(status)}`),
};
