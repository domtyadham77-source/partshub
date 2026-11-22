import type { D1DatabaseLike } from "../connection";
export interface CategorySummary { category:string; product_count:number; }
export async function listActiveCategories(db:D1DatabaseLike):Promise<CategorySummary[]> {
  const rows=await db.prepare("SELECT category,COUNT(*) AS product_count FROM products WHERE status='active' GROUP BY category ORDER BY category").all<CategorySummary>();
  return rows.results ?? [];
}
export async function categoryExists(db:D1DatabaseLike,category:string):Promise<boolean>{
  const row=await db.prepare("SELECT 1 AS found FROM products WHERE category=? AND status='active' LIMIT 1").bind(category).first<{found:number}>();
  return !!row;
}