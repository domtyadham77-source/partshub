import { PRODUCT_CATEGORIES } from "../types/category";
export const categoriesService={list:async()=>PRODUCT_CATEGORIES,get:(id:string)=>PRODUCT_CATEGORIES.find(item=>item.id===id)};
