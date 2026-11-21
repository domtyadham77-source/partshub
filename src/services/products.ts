import { apiRequest } from "./api";
import type { Product,ProductCategory } from "../types/product";
type ApiProduct={id:string;name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;description:string;pricePiasters:number;stockQuantity:number;seller:string;status:string;imageUrl?:string|null};
function mapProduct(item:ApiProduct):Product{return{id:item.id,name:item.name,category:item.category==="car_parts"?"Car parts":item.category==="motorcycle_parts"?"Motorcycle parts":"Workshop",fitment:item.fitment,price:item.pricePiasters/100,seller:item.seller,rating:0,description:item.description,stockStatus:item.stockQuantity>0?"in-stock":"out-of-stock"};}
export const productsService={
 list:async()=>{const result=await apiRequest<{items:ApiProduct[]}>("/products");return result.items.map(mapProduct);},
 get:async(id:string)=>{const result=await apiRequest<{product:ApiProduct}>(`/products/${encodeURIComponent(id)}`);return mapProduct(result.product);},
};
export function toApiCategory(category:ProductCategory):string{return category==="Car parts"?"car_parts":category==="Motorcycle parts"?"motorcycle_parts":"workshop";}
