import type { D1DatabaseLike } from "../connection";
export interface ProductRow {id:string;merchant_id:string;name:string;category:string;fitment:string;sku:string|null;description:string;price_piasters:number;stock_quantity:number;status:"draft"|"active"|"archived";created_at:string;updated_at:string;}
export async function findProductById(db:D1DatabaseLike,id:string):Promise<ProductRow|null>{return db.prepare("SELECT * FROM products WHERE id=? LIMIT 1").bind(id).first<ProductRow>();}
export async function listMerchantProducts(db:D1DatabaseLike,merchantId:string,limit=100):Promise<ProductRow[]>{
 const rows=await db.prepare("SELECT * FROM products WHERE merchant_id=? ORDER BY created_at DESC LIMIT ?").bind(merchantId,Math.min(100,Math.max(1,Math.trunc(limit)))).all<ProductRow>();return rows.results??[];
}
export async function setProductStatus(db:D1DatabaseLike,id:string,merchantId:string,status:ProductRow["status"]):Promise<boolean>{
 const result=await db.prepare("UPDATE products SET status=?,updated_at=? WHERE id=? AND merchant_id=?").bind(status,new Date().toISOString(),id,merchantId).run();return (result.meta.changes??0)>0;
}
export async function changeStock(db:D1DatabaseLike,id:string,merchantId:string,delta:number):Promise<boolean>{
 if(!Number.isSafeInteger(delta)||delta===0)throw new Error("Stock adjustment must be a non-zero integer.");
 const result=await db.prepare("UPDATE products SET stock_quantity=stock_quantity+?,updated_at=? WHERE id=? AND merchant_id=? AND stock_quantity+?>=0").bind(delta,new Date().toISOString(),id,merchantId,delta).run();return (result.meta.changes??0)>0;
}