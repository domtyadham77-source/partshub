import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { ordersService,type OrderSummary } from "../services/orders";
import { formatCurrency } from "../utils/formatCurrency";
const tone=(status:string)=>status==="delivered"||status==="accepted"?"success":status==="rejected"||status==="cancelled"?"neutral":"orange";
export default function OrdersPage(){
 const [items,setItems]=useState<OrderSummary[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{ordersService.list().then(result=>setItems(result.items)).catch(err=>setError(err instanceof Error?err.message:"Unable to load orders.")).finally(()=>setLoading(false))},[]);
 return <MainLayout><section className="orders-page"><span className="eyebrow">YOUR PURCHASES</span><h1>Order history.</h1>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Loading orders…</div>:items.length===0?<div className="cart-empty"><h2>No orders yet</h2><p>Your confirmed order requests will appear here.</p><Link className="ph-link-button" to="/">Explore marketplace</Link></div>:<div className="orders-list">{items.map(order=><Link className="order-card" to={`/orders/${order.id}`} key={order.id}><div><b>{order.order_number}</b><small>{new Date(order.created_at).toLocaleDateString()} · {order.store_name||"Parts Hub seller"}</small></div><div><Badge tone={tone(order.status)}>{order.status}</Badge><strong>{formatCurrency(order.total_piasters/100)}</strong></div></Link>)}</div>}</section></MainLayout>;
}
