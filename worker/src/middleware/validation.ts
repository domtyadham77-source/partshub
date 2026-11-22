export type ValidationResult<T>={ok:true;value:T}|{ok:false;response:Response};
export async function readJson<T=Record<string,unknown>>(request:Request,maxBytes=32_000):Promise<ValidationResult<T>>{
 const type=request.headers.get("Content-Type")??"";if(!type.toLowerCase().includes("application/json"))return{ok:false,response:validationError(415,"CONTENT_TYPE_REQUIRED","Send a JSON request body.")};
 const length=Number(request.headers.get("Content-Length")??0);if(length>maxBytes)return{ok:false,response:validationError(413,"BODY_TOO_LARGE","Request body is too large.")};
 let value:unknown;try{const raw=await request.text();if(new TextEncoder().encode(raw).length>maxBytes)return{ok:false,response:validationError(413,"BODY_TOO_LARGE","Request body is too large.")};value=JSON.parse(raw);}catch{return{ok:false,response:validationError(400,"INVALID_JSON","Request body must contain valid JSON.")};}
 if(!value||typeof value!=="object"||Array.isArray(value))return{ok:false,response:validationError(422,"INVALID_BODY","JSON body must be an object.")};
 return{ok:true,value:value as T};
}
export function cleanText(value:unknown,maxLength:number,minLength=0):string|null{
 if(typeof value!=="string")return null;const clean=value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"");return clean.length>=minLength&&clean.length<=maxLength?clean:null;
}
export function integerInRange(value:unknown,min:number,max:number):number|null{const n=typeof value==="number"?value:Number(value);return Number.isSafeInteger(n)&&n>=min&&n<=max?n:null;}
export function validationError(status:number,code:string,message:string):Response{return Response.json({error:{code,message}},{status,headers:{"Cache-Control":"no-store"}});}