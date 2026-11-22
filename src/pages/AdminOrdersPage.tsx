import { useEffect,useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { adminService } from "../services/admin";
import { formatCurrency } from "../utils/formatCurrency";
type Row={id:string;order_number:string;status:string;total_piasters:number;created_at:string;customer_name:string;store_name:string};
export default function AdminOrdersPage(){
 const [items,setItems]=useState<Row[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{adminService.orders().then(result=>setItems(result.items)).catch(err=>setError(err instanceof Error?err.message:"Unable to load orders.")).finally(()=>setLoading(false))},[]);
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">ORDER MONITORING</span><h1>Marketplace orders.</h1><p>View order requests across all sellers.</p>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Loading orders…</div>:items.length===0?<div className="catalog-state">No orders have been placed yet.</div>:<div className="admin-user-list">{items.map(order=><article key={order.id}><div><b>{order.order_number}</b><small>{order.customer_name} · {order.store_name}</small><span>{new Date(order.created_at).toLocaleDateString()}</span></div><div><Badge tone={order.status==="delivered"?"success":"orange"}>{order.status}</Badge><b>{formatCurrency(order.total_piasters/100)}</b></div></article>)}</div>}</section></MainLayout>;
}
