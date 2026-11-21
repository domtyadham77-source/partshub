import { apiRequest } from "./api";
import type { CartLine } from "../contexts/CartContext";
export type OrderSummary={id:string;order_number:string;status:string;subtotal_piasters:number;total_piasters:number;payment_method:string;payment_status:string;recipient_name:string;recipient_phone:string;address_line:string;city:string;area:string;notes:string;created_at:string;store_name?:string;customer_name?:string};
export type OrderItem={product_id:string;product_name:string;sku:string|null;unit_price_piasters:number;quantity:number;line_total_piasters:number};
export const ordersService={
 create:(items:CartLine[],address:{recipientName:string;recipientPhone:string;addressLine:string;city:string;area:string;notes:string})=>apiRequest<{orders:Array<{id:string;orderNumber:string;totalPiasters:number}>}>("/orders",{method:"POST",body:{items:items.map(line=>({productId:line.product.id,quantity:line.quantity})),...address,paymentMethod:"cash_on_delivery"}}),
 list:()=>apiRequest<{items:OrderSummary[]}>("/orders"),
 get:(id:string)=>apiRequest<{order:OrderSummary;items:OrderItem[]}>(`/orders/${encodeURIComponent(id)}`),
 cancel:(id:string)=>apiRequest<{success:true}>(`/orders/${encodeURIComponent(id)}/cancel`,{method:"POST",body:{}}),
};
