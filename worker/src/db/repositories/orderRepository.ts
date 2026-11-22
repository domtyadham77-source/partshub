import type { D1DatabaseLike } from "../connection";
export interface OrderRow {id:string;order_number:string;customer_id:string;merchant_id:string;status:string;subtotal_piasters:number;shipping_fee_piasters:number;total_piasters:number;payment_method:string;payment_status:string;created_at:string;updated_at:string;}
export async function findOrderForCustomer(db:D1DatabaseLike,id:string,customerId:string):Promise<OrderRow|null>{
  return db.prepare("SELECT * FROM orders WHERE id=? AND customer_id=? LIMIT 1").bind(id,customerId).first<OrderRow>();
}
export async function findOrderForMerchant(db:D1DatabaseLike,id:string,merchantId:string):Promise<OrderRow|null>{
  return db.prepare("SELECT * FROM orders WHERE id=? AND merchant_id=? LIMIT 1").bind(id,merchantId).first<OrderRow>();
}
export async function listCustomerOrders(db:D1DatabaseLike,customerId:string,limit=50):Promise<OrderRow[]>{
  const rows=await db.prepare("SELECT * FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT ?").bind(customerId,Math.min(100,Math.max(1,Math.trunc(limit)))).all<OrderRow>();return rows.results??[];
}
export async function updateOrderStatus(db:D1DatabaseLike,id:string,status:OrderRow["status"],expectedStatus?:string):Promise<boolean>{
  const sql=expectedStatus?"UPDATE orders SET status=?,updated_at=? WHERE id=? AND status=?":"UPDATE orders SET status=?,updated_at=? WHERE id=?";
  const values=expectedStatus?[status,new Date().toISOString(),id,expectedStatus]:[status,new Date().toISOString(),id];
  const result=await db.prepare(sql).bind(...values).run();return (result.meta.changes??0)>0;
}