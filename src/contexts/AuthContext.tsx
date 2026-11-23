import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from "react";
import type { RegisterInput,User } from "../types/user";
import { authService } from "../services/auth";
type AuthValue={user:User|null;loading:boolean;refresh:()=>Promise<void>;login:(email:string,password:string)=>Promise<void>;adminLogin:(password:string)=>Promise<void>;register:(input:RegisterInput)=>Promise<void>;logout:()=>Promise<void>};
const AuthContext=createContext<AuthValue|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{try{const result=await authService.me();setUser(result.user)}catch{setUser(null)}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const adminLogin=useCallback(async(password:string)=>{const result=await authService.login(password);setUser(result.user)},[]);
 const login=useCallback(async(_email:string,password:string)=>{await adminLogin(password)},[adminLogin]);
 const register=useCallback(async(input:RegisterInput)=>{const result=await authService.register(input);setUser(result.user)},[]);
 const logout=useCallback(async()=>{try{await authService.logout()}finally{setUser(null)}},[]);
 const value=useMemo(()=>({user,loading,refresh,login,adminLogin,register,logout}),[user,loading,refresh,login,adminLogin,register,logout]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error("useAuth must be used inside AuthProvider");return value;}
