import type { Env } from "../index";
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
const PRODUCT_CATEGORIES=[{id:"car_parts",name:"Car parts",description:"Replacement and performance parts for cars."},{id:"motorcycle_parts",name:"Motorcycle parts",description:"Parts and accessories for motorcycles."},{id:"workshop",name:"Workshop supplies",description:"Supplies and equipment for service centers."}];
export function matchesCategoriesRoute(path:string,method:string){return path==="/api/categories"&&method==="GET";}
export async function handleCategoriesRoute(request:Request,_env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesCategoriesRoute(url.pathname,request.method))return null;return json({data:{items:PRODUCT_CATEGORIES}});}
