import type { Env } from "../index";
const json=(data:unknown)=>new Response(JSON.stringify(data),{headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
export function matchesPaymentsRoute(path:string,method:string){return path==="/api/payments/methods"&&method==="GET";}
export async function handlePaymentsRoute(request:Request,_env:Env):Promise<Response|null>{const url=new URL(request.url);if(!matchesPaymentsRoute(url.pathname,request.method))return null;return json({data:{methods:[{id:"cash_on_delivery",label:"Cash on delivery",enabled:true},{id:"card",label:"Card",enabled:false},{id:"wallet",label:"Mobile wallet",enabled:false}]}});}
