import { apiRequest,apiUpload } from "./api";
import type { Product } from "../types/product";
type ApiProduct={id:string;name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;description:string;pricePiasters:number;stockQuantity:number;status:"draft"|"active"|"archived";seller:string;imageUrl?:string|null};
export type MerchantProduct=Product&{status:"draft"|"active"|"archived";stockQuantity:number};
function map(item:ApiProduct):MerchantProduct{return{id:item.id,name:item.name,category:item.category==="car_parts"?"Car parts":item.category==="motorcycle_parts"?"Motorcycle parts":"Workshop",fitment:item.fitment,description:item.description,imageUrl:item.imageUrl||undefined,price:item.pricePiasters/100,seller:item.seller,rating:0,stockStatus:item.stockQuantity>0?"in-stock":"out-of-stock",status:item.status,stockQuantity:item.stockQuantity};}
export const merchantService={
 listProducts:async()=>{const result=await apiRequest<{items:ApiProduct[]}>("/merchant/products");return result.items.map(map);},
 createProduct:(input:{name:string;category:"car_parts"|"motorcycle_parts"|"workshop";fitment:string;description:string;pricePiasters:number;stockQuantity:number;sku?:string})=>apiRequest<{id:string;status:string}>("/merchant/products",{method:"POST",body:input}),
 uploadImage:(id:string,image:Blob)=>{const form=new FormData();form.append("image",image,"product.jpg");return apiUpload<{imageUrl:string}>(`/merchant/products/${encodeURIComponent(id)}/image`,form);},
 archiveProduct:(id:string)=>apiRequest<{success:true}>(`/merchant/products/${encodeURIComponent(id)}`,{method:"DELETE"}),
 listOrders:()=>apiRequest<{items:Array<{id:string;order_number:string;status:string;total_piasters:number;created_at:string;customer_name:string;recipient_name:string;recipient_phone:string;address_line:string;city:string;area:string}>}>("/merchant/orders"),
 updateOrder:(id:string,status:"accepted"|"rejected"|"processing"|"shipped"|"delivered")=>apiRequest<{success:true;status:string}>(`/merchant/orders/${encodeURIComponent(id)}`,{method:"POST",body:{status}}),
};
