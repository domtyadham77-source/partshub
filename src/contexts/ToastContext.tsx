import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from "react";
import Toast,{type ToastKind} from "../components/ui/Toast";
type ToastItem={id:string;message:string;type:ToastKind};
type ToastValue={show:(message:string,type?:ToastKind)=>void;dismiss:(id:string)=>void};
const ToastContext=createContext<ToastValue|null>(null);
export function ToastProvider({children}:{children:ReactNode}){
 const [items,setItems]=useState<ToastItem[]>([]);
 const dismiss=useCallback((id:string)=>setItems(current=>current.filter(item=>item.id!==id)),[]);
 const show=useCallback((message:string,type:ToastKind="info")=>setItems(current=>[...current,{id:crypto.randomUUID(),message,type}].slice(-4)),[]);
 useEffect(()=>{if(!items.length)return;const timers=items.map(item=>window.setTimeout(()=>dismiss(item.id),4500));return()=>timers.forEach(window.clearTimeout)},[items,dismiss]);
 const value=useMemo(()=>({show,dismiss}),[show,dismiss]);
 return <ToastContext.Provider value={value}>{children}<div className="ph-toast-viewport" aria-live="polite">{items.map(item=><Toast key={item.id} message={item.message} type={item.type} onClose={()=>dismiss(item.id)}/>)}</div></ToastContext.Provider>;
}
export function useToast(){const value=useContext(ToastContext);if(!value)throw new Error("useToast must be used inside ToastProvider");return value;}
