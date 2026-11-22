import { apiUpload } from "./api";
export const uploadsService={uploadProductImage:(productId:string,image:Blob)=>{const form=new FormData();form.append("image",image,"product.jpg");return apiUpload<{imageUrl:string}>(`/merchant/products/${encodeURIComponent(productId)}/image`,form);}};
