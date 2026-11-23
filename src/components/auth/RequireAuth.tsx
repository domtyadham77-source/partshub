import type { ReactNode } from "react";
import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "../layout/MainLayout";
import Badge from "../ui/Badge";
export default function RequireAuth({children,roles}:{children:ReactNode;roles?:string[]}){
 const {user,loading}=useAuth();const location=useLocation();
 if(loading)return <MainLayout><section className="route-panel"><p>Checking your account…</p></section></MainLayout>;
 if(!user)return <Navigate to={roles?.includes("admin")?"/admin":"/login"} replace state={{from:location.pathname}}/>;
 if(roles&&!roles.includes(user.role))return <MainLayout><section className="route-panel"><Badge>ACCESS RESTRICTED</Badge><h1>This area isn't available to this account.</h1><p>Sign in with an account that has the required permissions.</p></section></MainLayout>;
 return <>{children}</>;
}
