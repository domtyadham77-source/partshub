import { apiRequest } from "./api";
import type { Product } from "../types/product";
type ApiProduct={id:string;name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;description:string;pricePiasters:number;stockQuantity:number;status:"draft"|"active"|"archived";seller:string};
export type MerchantProduct=Product&{status:"draft"|"active"|"archived";stockQuantity:number};
function map(item:ApiProduct):MerchantProduct{return{id:item.id,name:item.name,category:item.category==="car_parts"?"Car parts":item.category==="motorcycle_parts"?"Motorcycle parts":"Workshop",fitment:item.fitment,description:item.description,price:item.pricePiasters/100,seller:item.seller,rating:0,stockStatus:item.stockQuantity>0?"in-stock":"out-of-stock",status:item.status,stockQuantity:item.stockQuantity};}
export const merchantService={
 listProducts:async()=>{const result=await apiRequest<{items:ApiProduct[]}>("/merchant/products");return result.items.map(map);},
 createProduct:(input:{name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;description:string;pricePiasters:number;stockQuantity:number;sku?:string})=>apiRequest<{id:string;status:string}>("/merchant/products",{method:"POST",body:input}),
 archiveProduct:(id:string)=>apiRequest<{success:true}>(`/merchant/products/${encodeURIComponent(id)}`,{method:"DELETE"}),
};
