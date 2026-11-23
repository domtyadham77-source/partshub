import {useEffect} from "react";
import type {ReactNode} from "react";

const TARGETS = "main > section, .route-panel, .auth-card, .product-card, .product-detail, .cart-page, .checkout-page, .workshops-page, .settings-option, .shared-footer, .site-footer, .admin-page > *, .merchant-page > *";

export default function GlobalMotion({children}:{children:ReactNode}){
 useEffect(()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root=document.getElementById("root");
  if(!root)return;
  const reveal=(scope:ParentNode)=>{
   const nodes=scope.querySelectorAll<HTMLElement>(TARGETS);
   nodes.forEach((node,index)=>{
    if(node.dataset.globalReveal==="true")return;
    node.dataset.globalReveal="true";
    if(reduce){node.classList.add("is-visible");return;}
    node.style.setProperty("--global-reveal-delay",`${Math.min(index%5,4)*55}ms`);
    observer.observe(node);
   });
  };
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
   });
  },{threshold:.08,rootMargin:"0px 0px -24px 0px"});
  reveal(root);
  const mutation=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
   if(node instanceof HTMLElement){reveal(node);if(node.matches(TARGETS)&&node.dataset.globalReveal!=="true"){node.dataset.globalReveal="true";if(reduce)node.classList.add("is-visible");else observer.observe(node);}}
  })));
  mutation.observe(root,{childList:true,subtree:true});
  return()=>{mutation.disconnect();observer.disconnect();};
 },[]);
 return <>{children}</>;
}
