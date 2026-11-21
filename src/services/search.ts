import { productsService } from "./products";
import type { Product } from "../types/product";
export async function searchProducts(query:string):Promise<Product[]>{const items=await productsService.list();const q=query.trim().toLowerCase();if(!q)return items;return items.filter(item=>[item.name,item.fitment,item.seller,item.description].join(" ").toLowerCase().includes(q));}
