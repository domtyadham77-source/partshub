import type { D1DatabaseLike } from "../connection";
export interface OrderPaymentState {order_id:string;payment_method:"cash_on_delivery";payment_status:"unpaid"|"paid"|"refunded";total_piasters:number;}
export async function getOrderPaymentState(db:D1DatabaseLike,orderId:string):Promise<OrderPaymentState|null>{
 return db.prepare("SELECT id AS order_id,payment_method,payment_status,total_piasters FROM orders WHERE id=? LIMIT 1").bind(orderId).first<OrderPaymentState>();
}
/** Call only after an authorized, independently verified cash collection event. */
export async function confirmCashCollection(db:D1DatabaseLike,orderId:string):Promise<boolean>{
 const result=await db.prepare("UPDATE orders SET payment_status='paid',updated_at=? WHERE id=? AND payment_method='cash_on_delivery' AND payment_status='unpaid' AND status IN ('delivered','shipped')").bind(new Date().toISOString(),orderId).run();
 return(result.meta.changes??0)>0;
}