import { useEffect,useState } from "react";
import { Check,Archive,RefreshCw,Package } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { adminService } from "../services/admin";
import { formatCurrency } from "../utils/formatCurrency";
type Item={id:string;name:string;category:string;fitment:string;description:string;pricePiasters:number;stockQuantity:number;seller:string};
export default function AdminProductsPage(){
 const [items,setItems]=useState<Item[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [busy,setBusy]=useState("");
 async function load(){setLoading(true);setError("");try{setItems((await adminService.products("draft")).items)}catch(err){setError(err instanceof Error?err.message:"Unable to load product reviews.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 async function update(id:string,status:"active"|"archived"){setBusy(id);setError("");try{await adminService.setProductStatus(id,status);await load()}catch(err){setError(err instanceof Error?err.message:"Unable to update listing.")}finally{setBusy("")}}
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">LISTING MODERATION</span><h1>Product reviews.</h1><p>Draft listings are private until an administrator approves them.</p>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Loading listings…</div>:items.length===0?<div className="catalog-state">No product drafts waiting for review.</div>:<div className="admin-merchant-list">{items.map(item=><article key={item.id}><div><Badge tone="orange">DRAFT REVIEW</Badge><h3>{item.name}</h3><p>{item.seller} · {item.category} · {item.fitment}</p><small>{formatCurrency(item.pricePiasters/100)} · Quantity {item.stockQuantity}</small>{item.description&&<p>{item.description}</p>}</div><div className="admin-review-actions"><button disabled={busy===item.id} onClick={()=>void update(item.id,"active")}><Check size={15}/> Publish</button><button disabled={busy===item.id} onClick={()=>void update(item.id,"archived")}><Archive size={15}/> Archive</button></div></article>)}</div>}<button className="admin-refresh" onClick={()=>void load()}><RefreshCw size={14}/> Refresh</button></section></MainLayout>;
}
