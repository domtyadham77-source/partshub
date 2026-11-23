import { useState,type FormEvent } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Eye,EyeOff,LockKeyhole,ShieldCheck } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { ApiRequestError } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdminEntryPage(){
 const {user,loading,adminLogin}=useAuth();
 const navigate=useNavigate();
 const {t}=useLanguage();
 const [password,setPassword]=useState("");
 const [visible,setVisible]=useState(false);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);

 if(loading)return <MainLayout><section className="admin-entry-page"><div className="admin-entry-card"><span className="admin-entry-spinner"/></div></section></MainLayout>;
 if(user?.role==="admin")return <Navigate to="/admin/dashboard" replace/>;

 async function submit(event:FormEvent){
  event.preventDefault();setError("");setBusy(true);
  try{await adminLogin(password);navigate("/admin/dashboard",{replace:true});}
  catch(err){setError(err instanceof ApiRequestError?err.message:t("Unable to sign in. Please try again."));}
  finally{setBusy(false);}
 }
 return <MainLayout>
  <section className="admin-entry-page">
   <div className="admin-entry-card">
    <div className="admin-entry-icon"><ShieldCheck size={27}/></div>
    <span className="eyebrow">{t("PARTS HUB CONTROL CENTER")}</span>
    <h1>{t("Administrator sign in")}</h1>
    <p>{t("Enter your administrator password to continue to the control panel.")}</p>
    <form onSubmit={submit}>
     <div className="admin-password-wrap">
      <Input label={t("Password")} name="admin-password" type={visible?"text":"password"} autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} placeholder={t("Enter administrator password")} className="admin-password-input"/>
      <button className="admin-password-toggle" type="button" onClick={()=>setVisible(value=>!value)} aria-label={visible?t("Hide password"):t("Show password")} title={visible?t("Hide password"):t("Show password")}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button>
     </div>
     {error&&<div className="auth-error" role="alert">{error}</div>}
     <Button type="submit" disabled={busy}>{busy?t("Checking password…"):t("Enter control panel")}</Button>
    </form>
    <div className="admin-entry-foot"><LockKeyhole size={14}/><span>{t("Secure administrator access")}</span></div>
   </div>
  </section>
 </MainLayout>;
}

