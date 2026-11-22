import { useState,type FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import { ArrowLeft,UserRoundPlus,Eye,EyeOff } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { ApiRequestError } from "../services/api";
import {useLanguage} from "../contexts/LanguageContext";

export default function RegisterPage(){
 const {register}=useAuth();const navigate=useNavigate();const {t}=useLanguage();
 const [fullName,setFullName]=useState("");const [email,setEmail]=useState("");const [phone,setPhone]=useState("");
 const [password,setPassword]=useState("");const [showPassword,setShowPassword]=useState(false);
 const [role,setRole]=useState<"customer"|"merchant">("customer");
 const [businessType,setBusinessType]=useState<"parts_store"|"garage"|"maintenance_center"|"motorcycle_workshop">("parts_store");
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError("");setBusy(true);try{await register({fullName:fullName.trim(),email:email.trim().toLowerCase(),phone:phone.trim()||undefined,password,role,businessType});navigate("/account")}catch(err){setError(err instanceof ApiRequestError?err.message:"Unable to create your account. Please try again.")}finally{setBusy(false)}}
 return <MainLayout><section className="auth-page"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Back to marketplace</Link><div className="auth-card"><div className="auth-icon"><UserRoundPlus/></div><span className="eyebrow">{t("JOIN THE MARKETPLACE")}</span><h1>{t("Make it yours.")}</h1><p>{t("Create one account to get started with Parts Hub.")}</p><form onSubmit={submit}>
  <Input label={t("Full name")} name="name" autoComplete="name" required minLength={2} maxLength={90} value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name"/>
  <Input label={t("Email address")} name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
  <Input label={t("Phone number (optional)")} name="tel" type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+20…"/>
  <div className="ph-field"><label>{t("Account type")}</label><div className="role-options"><button type="button" className={role==="customer"?"selected":""} onClick={()=>setRole("customer")}>{t("I want to buy")}</button><button type="button" className={role==="merchant"?"selected":""} onClick={()=>setRole("merchant")}>{t("I want to sell")}</button></div></div>
  {role==="merchant"&&<div className="ph-field"><label htmlFor="business-type">{t("Business type")}</label><select id="business-type" className="ph-input" value={businessType} onChange={e=>setBusinessType(e.target.value as typeof businessType)}><option value="parts_store">{t("Parts store / trader")}</option><option value="garage">{t("Garage / workshop")}</option><option value="maintenance_center">{t("Maintenance center")}</option><option value="motorcycle_workshop">{t("Motorcycle workshop")}</option></select></div>}
  <div className="ph-field"><label htmlFor="register-password">{t("Password")}</label><div style={{position:"relative"}}><input id="register-password" className="ph-input" style={{paddingRight:"94px"}} name="new-password" type={showPassword?"text":"password"} autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a strong password" aria-describedby="register-password-hint"/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?"Hide password":"Show password"} aria-pressed={showPassword} style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",display:"inline-flex",alignItems:"center",gap:"5px",border:0,background:"transparent",color:"#FF9500",fontSize:"11px",fontWeight:800,letterSpacing:".4px",padding:"7px 3px"}}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}{showPassword?"HIDE":"SHOW"}</button></div><small id="register-password-hint" className="field-hint">{t("At least 10 characters.")}</small></div>
  {error&&<div className="auth-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?t("Creating account…"):t("Create account")}</Button>
 </form><div className="auth-inline"><span>{t("Already registered?")} <Link to="/login">{t("Sign in")}</Link></span></div><p className="auth-legal">{t("Merchant accounts may require review before selling features are enabled.")}</p></div></section></MainLayout>;
}
