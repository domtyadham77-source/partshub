import { useState,type FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import { ArrowLeft,LockKeyhole } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { ApiRequestError } from "../services/api";
export default function LoginPage(){
 const {login}=useAuth();const navigate=useNavigate();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError("");setBusy(true);try{await login(email.trim().toLowerCase(),password);navigate("/account")}catch(err){setError(err instanceof ApiRequestError?err.message:"Unable to sign in. Please try again.")}finally{setBusy(false)}}
 return <MainLayout><section className="auth-page"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Back to marketplace</Link><div className="auth-card"><div className="auth-icon"><LockKeyhole/></div><span className="eyebrow">YOUR PARTS HUB ACCOUNT</span><h1>Welcome back.</h1><p>Sign in to manage your parts, orders, and saved items.</p><form onSubmit={submit}><Input label="Email address" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><Input label="Password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/>{error&&<div className="auth-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button></form><div className="auth-inline"><Link to="/forgot-password">Forgot password?</Link><span>New to Parts Hub? <Link to="/register">Create account</Link></span></div></div></section></MainLayout>;
}
