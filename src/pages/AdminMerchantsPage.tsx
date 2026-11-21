import { useEffect,useState } from "react";
import { Check,RefreshCw,X } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { adminService,type AdminMerchant } from "../services/admin";
export default function AdminMerchantsPage(){
 const [items,setItems]=useState<AdminMerchant[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [busy,setBusy]=useState("");
 async function load(){setLoading(true);setError("");try{setItems((await adminService.merchants("pending")).items)}catch(err){setError(err instanceof Error?err.message:"Unable to load merchant applications.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 async function update(id:string,status:"active"|"rejected"){setBusy(id);setError("");try{await adminService.setMerchantStatus(id,status);await load()}catch(err){setError(err instanceof Error?err.message:"Unable to update merchant status.")}finally{setBusy("")}}
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">SELLER VERIFICATION</span><h1>Merchant applications.</h1><p>Review new seller accounts before granting inventory access.</p>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Loading applications…</div>:items.length===0?<div className="catalog-state">No pending merchant applications.</div>:<div className="admin-merchant-list">{items.map(item=><article key={item.id}><div><Badge tone="orange">PENDING REVIEW</Badge><h3>{item.store_name}</h3><p>{item.full_name} · {item.email}</p>{item.contact_phone&&<small>{item.contact_phone}</small>}{item.description&&<p>{item.description}</p>}</div><div className="admin-review-actions"><button disabled={busy===item.id} onClick={()=>void update(item.id,"active")}><Check size={15}/> Approve</button><button disabled={busy===item.id} onClick={()=>void update(item.id,"rejected")}><X size={15}/> Reject</button></div></article>)}</div>}<button className="admin-refresh" onClick={()=>void load()}><RefreshCw size={14}/> Refresh</button></section></MainLayout>;
}
