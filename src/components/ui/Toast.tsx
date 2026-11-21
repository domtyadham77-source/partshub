import { CheckCircle2,AlertCircle,Info,AlertTriangle,X } from "lucide-react";
import "./Toast.css";
export type ToastKind="success"|"error"|"info"|"warning";
export default function Toast({message,type="info",onClose}:{message:string;type?:ToastKind;onClose:()=>void}){
 const Icon=type==="success"?CheckCircle2:type==="error"?AlertCircle:type==="warning"?AlertTriangle:Info;
 return <div className={`ph-toast ph-toast-${type}`} role="status"><Icon size={17}/><span>{message}</span><button type="button" aria-label="Dismiss notification" onClick={onClose}><X size={15}/></button></div>;
}
