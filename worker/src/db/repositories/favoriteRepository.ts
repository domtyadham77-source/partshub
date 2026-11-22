import type { D1DatabaseLike } from "../connection";
/** Favorites are stored per customer; the schema migration for this feature must exist before calling these methods. */
export async function listFavoriteProductIds(db:D1DatabaseLike,userId:string):Promise<string[]> {
  const rows=await db.prepare("SELECT product_id FROM favorites WHERE user_id=? ORDER BY created_at DESC").bind(userId).all<{product_id:string}>();
  return (rows.results??[]).map(x=>x.product_id);
}
export async function addFavorite(db:D1DatabaseLike,userId:string,productId:string):Promise<void>{
  await db.prepare("INSERT INTO favorites(id,user_id,product_id) VALUES(?,?,?) ON CONFLICT(user_id,product_id) DO NOTHING").bind(crypto.randomUUID(),userId,productId).run();
}
export async function removeFavorite(db:D1DatabaseLike,userId:string,productId:string):Promise<boolean>{
  const result=await db.prepare("DELETE FROM favorites WHERE user_id=? AND product_id=?").bind(userId,productId).run();
  return (result.meta.changes??0)>0;
}