import { env } from "../config/env";
export class ApiRequestError extends Error {
  status: number; code: string; fields?: Record<string,string>;
  constructor(message:string,status:number,code="REQUEST_FAILED",fields?:Record<string,string>){super(message);this.name="ApiRequestError";this.status=status;this.code=code;this.fields=fields;}
}
type RequestOptions = Omit<RequestInit,"body"> & { body?: unknown };
export async function apiRequest<T>(path:string,options:RequestOptions={}):Promise<T>{
  const headers=new Headers(options.headers);
  headers.set("Accept","application/json");
  if(options.body!==undefined) headers.set("Content-Type","application/json");
  let response:Response;
  try { response=await fetch(`${env.apiBaseUrl}${path.startsWith("/")?path:`/${path}`}`,{...options,headers,credentials:"include",body:options.body===undefined?undefined:JSON.stringify(options.body)}); }
  catch { throw new ApiRequestError("Unable to reach Parts Hub. Check your connection and try again.",0,"NETWORK_ERROR"); }
  const payload=await response.json().catch(()=>null) as {data?:T;error?:{code?:string;message?:string;fields?:Record<string,string>}}|null;
  if(!response.ok) throw new ApiRequestError(payload?.error?.message||"Something went wrong. Please try again.",response.status,payload?.error?.code,payload?.error?.fields);
  return (payload&&"data" in payload?payload.data:payload) as T;
}
