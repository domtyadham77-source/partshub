export interface Env { DB:D1Database; ALLOWED_ORIGIN?:string; SESSION_TTL_DAYS?:string; ADMIN_EMAIL?:string; ADMIN_PASSWORD?:string }
type PublicUser={id:string;fullName:string;email:string;phone:string|null;role:"customer"|"merchant"|"admin";status:"active"|"pending"|"suspended";createdAt:string};
const json=(data:unknown,status=200,headers:HeadersInit={})=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});
const fail=(status:number,code:string,message:string)=>json({error:{code,message}},status);
function corsHeaders(request:Request,env:Env){const origin=request.headers.get("Origin");const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(v=>v.trim()).filter(Boolean);const headers=new Headers();if(origin&&allowed.includes(origin)){headers.set("Access-Control-Allow-Origin",origin);headers.set("Access-Control-Allow-Credentials","true");headers.set("Vary","Origin");}headers.set("Access-Control-Allow-Methods","GET,POST,OPTIONS");headers.set("Access-Control-Allow-Headers","Content-Type");headers.set("Access-Control-Max-Age","86400");return headers;}
function secureHeaders(response:Response){const h=new Headers(response.headers);h.set("X-Content-Type-Options","nosniff");h.set("Referrer-Policy","strict-origin-when-cross-origin");h.set("X-Frame-Options","DENY");h.set("Permissions-Policy","camera=(), microphone=(), geolocation=()");return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});}
function cookieValue(request:Request,name:string){return request.headers.get("Cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="))?.slice(name.length+1)||null;}
function hex(bytes:ArrayBuffer){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,"0")).join("");}
function randomToken(bytes=32){const data=new Uint8Array(bytes);crypto.getRandomValues(data);return [...data].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function digest(value:string){return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)));}
async function passwordHash(password:string,salt:string,iterations=310000){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(salt.match(/.{2}/g)!.map(x=>parseInt(x,16))),iterations,hash:"SHA-256"},key,256);return hex(bits);}
function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;}
function publicUser(row:any):PublicUser{return{id:row.id,fullName:row.full_name,email:row.email,phone:row.phone,role:row.role,status:row.status,createdAt:row.created_at};}
async function createNotification(env:Env,userId:string,title:string,message:string,type:"info"|"success"|"warning"="info",createdBy:string|null=null){try{await env.DB.prepare("INSERT INTO notifications(id,user_id,created_by,title,message,type) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(),userId,createdBy,title,message,type).run();}catch{/* Notifications must never block the primary action. */}}
async function allowAuthAttempt(request:Request,env:Env,scope:string,limit:number,windowSeconds=900){
 const ip=request.headers.get("CF-Connecting-IP")||"unknown";
 const key=await digest(scope+":"+ip);
 const since=new Date(Date.now()-windowSeconds*1000).toISOString();
 const row=await env.DB.prepare("SELECT COUNT(*) AS total FROM auth_attempts WHERE key_hash=? AND created_at>?").bind(key,since).first<{total:number}>();
 await env.DB.prepare("INSERT INTO auth_attempts(id,key_hash) VALUES(?,?)").bind(crypto.randomUUID(),key).run();
 await env.DB.prepare("DELETE FROM auth_attempts WHERE created_at<?").bind(new Date(Date.now()-86400000).toISOString()).run();
 return (row?.total||0)<limit;
}

import { handleAuthRoute } from "./routes/auth";
import { handleOrdersRoute } from "./routes/orders";
import { handleNotificationsRoute } from "./routes/notifications";
import { handleSupportRoute } from "./routes/support";
import { handleAdminRoute } from "./routes/admin";
import { handleMerchantRoute } from "./routes/merchants";
import { handleUploadsRoute } from "./routes/uploads";
import { handleProductsRoute } from "./routes/products";
import { handleCartRoute } from "./routes/cart";
import { handleFavoritesRoute } from "./routes/favorites";
import { handlePaymentsRoute } from "./routes/payments";
import { handleReviewsRoute } from "./routes/reviews";
import { handleCategoriesRoute } from "./routes/categories";
import { handleSearchRoute } from "./routes/search";
import { handleUsersRoute } from "./routes/users";

type MerchantRow={id:string;user_id:string;store_name:string;description:string;contact_phone:string|null;status:string;business_type:string;city:string;area:string;address_line:string};
function publicProduct(row:any){return{id:row.id,name:row.name,category:row.category,fitment:row.fitment,sku:row.sku,description:row.description,pricePiasters:row.price_piasters,stockQuantity:row.stock_quantity,status:row.status,seller:row.store_name,imageUrl:row.image_id?"/api/images/"+row.image_id:null,createdAt:row.created_at};}
async function merchantFor(request:Request,env:Env,allowPending=false){const user=await readUser(request,env);if(!user)return{error:fail(401,"UNAUTHENTICATED","Sign in to continue.")};if(user.role!=="merchant")return{error:fail(403,"MERCHANT_ONLY","A merchant account is required.")};const merchant=await env.DB.prepare("SELECT * FROM merchant_profiles WHERE user_id=?").bind(user.id).first<MerchantRow>();if(!merchant)return{error:fail(404,"MERCHANT_PROFILE_MISSING","Merchant profile was not found.")};if(merchant.status!=="active"&&!allowPending)return{error:fail(403,"MERCHANT_NOT_APPROVED","Your seller account must be approved before managing listings.")};return{user,merchant};}
async function readUser(request:Request,env:Env){const token=cookieValue(request,"ph_session");if(!token)return null;const hash=await digest(token);const row=await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status!='suspended'").bind(hash,new Date().toISOString()).first<any>();return row?publicUser(row):null;}
async function createSession(userId:string,env:Env){const token=randomToken();const days=Math.min(30,Math.max(1,Number(env.SESSION_TTL_DAYS)||14));const expires=new Date(Date.now()+days*86400000).toISOString();await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),userId,await digest(token),expires).run();return {token,expires};}
function cookie(token:string,maxAge:number){return `ph_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;}
function clearCookie(){return "ph_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";}
async function handle(request:Request,env:Env):Promise<Response>{
 const url=new URL(request.url);if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders(request,env)});
 if(url.pathname==="/api/health")return json({data:{ok:true,service:"parts-hub-api"}});



 const origin=request.headers.get("Origin");const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(x=>x.trim()).filter(Boolean);if(origin&&origin!==url.origin&&!allowed.includes(origin))return fail(403,"ORIGIN_NOT_ALLOWED","This origin is not allowed.");



   const ordersResponse=await handleOrdersRoute(request,env);if(ordersResponse)return ordersResponse;
  const notificationsResponse=await handleNotificationsRoute(request,env);if(notificationsResponse)return notificationsResponse;
  const supportResponse=await handleSupportRoute(request,env);if(supportResponse)return supportResponse;
  const adminResponse=await handleAdminRoute(request,env);if(adminResponse)return adminResponse;
  const merchantResponse=await handleMerchantRoute(request,env);if(merchantResponse)return merchantResponse;
  const uploadsResponse=await handleUploadsRoute(request,env);if(uploadsResponse)return uploadsResponse;
  const productsResponse=await handleProductsRoute(request,env);if(productsResponse)return productsResponse;
  const cartResponse=await handleCartRoute(request,env);if(cartResponse)return cartResponse;
  const favoritesResponse=await handleFavoritesRoute(request,env);if(favoritesResponse)return favoritesResponse;
  const paymentsResponse=await handlePaymentsRoute(request,env);if(paymentsResponse)return paymentsResponse;
  const reviewsResponse=await handleReviewsRoute(request,env);if(reviewsResponse)return reviewsResponse;
  const categoriesResponse=await handleCategoriesRoute(request,env);if(categoriesResponse)return categoriesResponse;
  const searchResponse=await handleSearchRoute(request,env);if(searchResponse)return searchResponse;
  const usersResponse=await handleUsersRoute(request,env);if(usersResponse)return usersResponse;
  const authResponse = await handleAuthRoute(request, env);
 if (authResponse) return authResponse;
 if (request.method !== "POST") return fail(405, "METHOD_NOT_ALLOWED", "Method not allowed.");
 try { await request.json(); } catch { return fail(400, "INVALID_JSON", "Request body must be valid JSON."); }
 return fail(404, "NOT_FOUND", "Endpoint not found.");
}
export default {async fetch(request:Request,env:Env){let response:Response;try{response=await handle(request,env)}catch(error){console.error("parts_hub_request_failed",error);response=fail(500,"INTERNAL_ERROR","The service could not complete this request. Please try again later.");}const cors=corsHeaders(request,env);const headers=new Headers(response.headers);cors.forEach((v,k)=>headers.set(k,v));return secureHeaders(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));}};
