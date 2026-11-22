import type { D1DatabaseLike } from "../connection";
export interface ReviewRow {id:string;product_id:string;user_id:string;rating:number;comment:string;created_at:string;}
/** Reviews require a reviews table migration; methods intentionally fail clearly if it has not been applied. */
export async function listProductReviews(db:D1DatabaseLike,productId:string,limit=50):Promise<ReviewRow[]>{
 const rows=await db.prepare("SELECT id,product_id,user_id,rating,comment,created_at FROM reviews WHERE product_id=? ORDER BY created_at DESC LIMIT ?").bind(productId,Math.min(100,Math.max(1,Math.trunc(limit)))).all<ReviewRow>();return rows.results??[];
}
export async function createReview(db:D1DatabaseLike,input:{id?:string;productId:string;userId:string;rating:number;comment:string}):Promise<string>{
 const comment=input.comment.trim();if(!Number.isInteger(input.rating)||input.rating<1||input.rating>5||comment.length>2000)throw new Error("Review rating or comment is invalid.");
 const id=input.id??crypto.randomUUID();
 await db.prepare("INSERT INTO reviews(id,product_id,user_id,rating,comment) VALUES(?,?,?,?,?)").bind(id,input.productId,input.userId,input.rating,comment).run();return id;
}