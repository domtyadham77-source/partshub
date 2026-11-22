import { useEffect,type ReactNode } from "react";
import { X } from "lucide-react";
import "./Modal.css";
type Props={open:boolean;title:string;onClose:()=>void;children:ReactNode;footer?:ReactNode};
export default function Modal({open,title,onClose,children,footer}:Props){
 useEffect(()=>{if(!open)return;const handle=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};window.addEventListener("keydown",handle);return()=>window.removeEventListener("keydown",handle)},[open,onClose]);
 if(!open)return null;
 return <div className="ph-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="ph-modal" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={18}/></button></header><div className="ph-modal-content">{children}</div>{footer&&<footer>{footer}</footer>}</section></div>;
}
