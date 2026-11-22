import { useState,type FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import { ArrowLeft,LockKeyhole } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { ApiRequestError } from "../services/api";
import {useLanguage} from "../contexts/LanguageContext";
export default function LoginPage(){
 const {login}=useAuth();const navigate=useNavigate();const {t}=useLanguage();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError("");setBusy(true);try{await login(email.trim().toLowerCase(),password);navigate("/account")}catch(err){setError(err instanceof ApiRequestError?err.message:"Unable to sign in. Please try again.")}finally{setBusy(false)}}
 return <MainLayout><section className="auth-page"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Back to marketplace</Link><div className="auth-card"><div className="auth-icon"><LockKeyhole/></div><span className="eyebrow">{t("YOUR PARTS HUB ACCOUNT")}</span><h1>{t("Welcome back.")}</h1><p>{t("Sign in to manage your parts, orders, and saved items.")}</p><form onSubmit={submit}><Input label={t("Email address")} name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><Input label={t("Password")} name="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder={t("Enter your password")}/>{error&&<div className="auth-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?t("Signing in…"):t("Sign in")}</Button></form><div className="auth-inline"><Link to="/forgot-password">{t("Forgot password?")}</Link><span>{t("New to Parts Hub?")} <Link to="/register">{t("Create account")}</Link></span></div></div></section></MainLayout>;
}
