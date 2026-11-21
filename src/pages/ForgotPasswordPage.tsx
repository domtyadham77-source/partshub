import { useState,type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft,MailCheck } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { authService } from "../services/auth";
import { ApiRequestError } from "../services/api";
export default function ForgotPasswordPage(){
 const [email,setEmail]=useState("");const [error,setError]=useState("");const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError("");setBusy(true);try{await authService.requestPasswordReset(email.trim().toLowerCase());setSent(true)}catch(err){setError(err instanceof ApiRequestError?err.message:"Unable to submit the request. Please try again.")}finally{setBusy(false)}}
 return <MainLayout><section className="auth-page"><Link to="/login" className="auth-back"><ArrowLeft size={15}/> Back to sign in</Link><div className="auth-card"><div className="auth-icon"><MailCheck/></div><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Forgot your password?</h1>{sent?<div className="auth-success" role="status">If an account matches that email, recovery instructions will be sent when email delivery is configured. Check your inbox later, including spam.</div>:<><p>Enter the email address linked to your account.</p><form onSubmit={submit}><Input label="Email address" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>{error&&<div className="auth-error" role="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?"Sending…":"Continue"}</Button></form></>}<div className="auth-inline"><span>Remembered it? <Link to="/login">Sign in</Link></span></div></div></section></MainLayout>;
}
