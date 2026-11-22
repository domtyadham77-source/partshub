import type { AuthUser } from "./auth";
export type AppRole=AuthUser["role"];
export function hasRole(user:AuthUser|null|undefined,allowed:AppRole[]):boolean{return !!user&&allowed.includes(user.role)&&user.status==="active";}
export function requireRole(user:AuthUser|null|undefined,allowed:AppRole[]):Response|null{
 if(!user)return Response.json({error:{code:"UNAUTHENTICATED",message:"Sign in to continue."}},{status:401});
 if(user.status!=="active")return Response.json({error:{code:"ACCOUNT_NOT_ACTIVE",message:"This account is not active."}},{status:403});
 if(!allowed.includes(user.role))return Response.json({error:{code:"FORBIDDEN",message:"You do not have permission to perform this action."}},{status:403});
 return null;
}
export function isOwnerOrAdmin(user:AuthUser|null|undefined,ownerUserId:string):boolean{return !!user&&user.status==="active"&&(user.role==="admin"||user.id===ownerUserId);}