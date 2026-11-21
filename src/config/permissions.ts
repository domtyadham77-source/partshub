import type { UserRole,UserStatus } from "../types/user";
export function canAccessRole(role:UserRole|undefined,allowed:UserRole[]){return !!role&&allowed.includes(role);}
export function canManageMarketplace(role:UserRole|undefined){return role==="admin";}
export function canSell(role:UserRole|undefined,status:UserStatus|undefined){return role==="merchant"&&status==="active";}
export function canPlaceOrder(role:UserRole|undefined,status:UserStatus|undefined){return (role==="customer"||role==="merchant")&&status==="active";}
