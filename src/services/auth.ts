import { apiRequest } from "./api";
import type { AuthResponse, RegisterInput, User } from "../types/user";
export const authService = {
  me:()=>apiRequest<{user:User|null}>("/auth/me"),
  login:(email:string,password:string)=>apiRequest<AuthResponse>("/auth/login",{method:"POST",body:{email,password}}),
  register:(input:RegisterInput)=>apiRequest<AuthResponse>("/auth/register",{method:"POST",body:input}),
  logout:()=>apiRequest<{success:true}>("/auth/logout",{method:"POST"}),
  requestPasswordReset:(email:string)=>apiRequest<{accepted:true}>("/auth/forgot-password",{method:"POST",body:{email}}),
};
