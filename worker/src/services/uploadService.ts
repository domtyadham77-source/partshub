import type { D1DatabaseLike } from "../db/connection";
const MAX_IMAGE_BYTES=1_000_000;
const ALLOWED_TYPES=new Set(["image/jpeg","image/png","image/webp"]);
export interface ImageUpload {productId:string;merchantId:string;contentType:string;bytes:ArrayBuffer;}
export async function saveProductImage(db:D1DatabaseLike,input:ImageUpload):Promise<string>{
 if(!ALLOWED_TYPES.has(input.contentType))throw new Error("Only JPEG, PNG, and WebP images are supported.");
 if(input.bytes.byteLength<1||input.bytes.byteLength>MAX_IMAGE_BYTES)throw new Error("Image must be between 1 byte and 1 MB.");
 const product=await db.prepare("SELECT id FROM products WHERE id=? AND merchant_id=? LIMIT 1").bind(input.productId,input.merchantId).first<{id:string}>();
 if(!product)throw new Error("Product does not belong to this merchant.");
 const id=crypto.randomUUID();
 await db.prepare("INSERT INTO product_images(id,product_id,content_type,byte_size,image_data) VALUES(?,?,?,?,?) ON CONFLICT(product_id) DO UPDATE SET id=excluded.id,content_type=excluded.content_type,byte_size=excluded.byte_size,image_data=excluded.image_data,created_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')").bind(id,input.productId,input.contentType,input.bytes.byteLength,input.bytes).run();
 return id;
}
export async function deleteProductImage(db:D1DatabaseLike,productId:string,merchantId:string):Promise<boolean>{
 const result=await db.prepare("DELETE FROM product_images WHERE product_id=? AND EXISTS(SELECT 1 FROM products WHERE products.id=? AND products.merchant_id=?)").bind(productId,productId,merchantId).run();return(result.meta.changes??0)>0;
}