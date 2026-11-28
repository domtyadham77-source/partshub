import { apiRequest } from "./api";
import type { Product,ProductCategory,ProductOffer } from "../types/product";
type ApiOffer={id:string;pricePiasters:number;stockQuantity:number};
type ApiProduct={id:string;name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;sku:string|null;description:string;pricePiasters:number;stockQuantity:number;status:string;seller?:string;imageUrl?:string|null;imageUrls?:string[];offerCount?:number;offers?:ApiOffer[]};
function mapProduct(item:ApiProduct):Product{return{id:item.id,name:item.name,category:item.category==="car_parts"?"Car parts":item.category==="motorcycle_parts"?"Motorcycle parts":"Workshop",fitment:item.fitment,price:item.pricePiasters/100,seller:"Parts Hub",rating:0,description:item.description,stockStatus:item.stockQuantity>0?"in-stock":"out-of-stock",imageUrl:item.imageUrl||item.imageUrls?.[0]||undefined,imageUrls:item.imageUrls||((item.imageUrl)?[item.imageUrl]:[]),offerCount:item.offerCount||item.offers?.length||1,offers:item.offers?.map((offer):ProductOffer=>({id:offer.id,price:offer.pricePiasters/100,stockQuantity:offer.stockQuantity,stockStatus:offer.stockQuantity>0?"in-stock":"out-of-stock"}))};}
export const productsService={
 list:async()=>{const result=await apiRequest<{items:ApiProduct[]}>("/products");return result.items.map(mapProduct);},
 get:async(id:string)=>{const result=await apiRequest<{product:ApiProduct}>(`/products/${encodeURIComponent(id)}`);return mapProduct(result.product);},
};
export function toApiCategory(category:ProductCategory):string{return category==="Car parts"?"car_parts":category==="Motorcycle parts"?"motorcycle_parts":"workshop";}
