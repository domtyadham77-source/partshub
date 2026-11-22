import type { D1DatabaseLike } from "../connection";
export interface CartLine { productId:string; quantity:number; }
export interface CartProduct { id:string; name:string; sku:string|null; price_piasters:number; stock_quantity:number; merchant_id:string; store_name:string; }
export async function getAvailableCartProducts(db:D1DatabaseLike, productIds:string[]):Promise<CartProduct[]> {
  const ids=[...new Set(productIds)].filter(Boolean).slice(0,30);
  if(!ids.length)return [];
  const marks=ids.map(()=>"?").join(",");
  const result=await db.prepare(`SELECT p.id,p.name,p.sku,p.price_piasters,p.stock_quantity,p.merchant_id,m.store_name
    FROM products p JOIN merchant_profiles m ON m.id=p.merchant_id JOIN users u ON u.id=m.user_id
    WHERE p.id IN (${marks}) AND p.status='active' AND m.status='active' AND u.status='active'`).bind(...ids).all<CartProduct>();
  return result.results ?? [];
}
export async function validateCart(db:D1DatabaseLike, lines:CartLine[]):Promise<{valid:boolean;items:Array<CartProduct&{quantity:number;lineTotalPiasters:number}>;subtotalPiasters:number;error?:string}> {
  if(!Array.isArray(lines)||lines.length<1||lines.length>30)return {valid:false,items:[],subtotalPiasters:0,error:"Cart must contain between 1 and 30 items."};
  const merged=new Map<string,number>();
  for(const line of lines){if(!line.productId||!Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>99)return {valid:false,items:[],subtotalPiasters:0,error:"Invalid cart line."};merged.set(line.productId,(merged.get(line.productId)??0)+line.quantity);}
  const products=await getAvailableCartProducts(db,[...merged.keys()]);
  if(products.length!==merged.size)return {valid:false,items:[],subtotalPiasters:0,error:"One or more products are unavailable."};
  let subtotal=0;const items=[];
  for(const p of products){const quantity=merged.get(p.id)!;if(p.stock_quantity<quantity)return {valid:false,items:[],subtotalPiasters:0,error:`Insufficient stock for ${p.name}.`};const lineTotalPiasters=p.price_piasters*quantity;if(!Number.isSafeInteger(lineTotalPiasters))return {valid:false,items:[],subtotalPiasters:0,error:"Cart total is too large."};subtotal+=lineTotalPiasters;items.push({...p,quantity,lineTotalPiasters});}
  return {valid:true,items,subtotalPiasters:subtotal};
}