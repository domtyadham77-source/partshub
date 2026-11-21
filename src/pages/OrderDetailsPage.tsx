import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { ordersService,type OrderSummary,type OrderItem } from "../services/orders";
import { formatCurrency } from "../utils/formatCurrency";
export default function OrderDetailsPage(){
 const {id}=useParams();const [order,setOrder]=useState<OrderSummary|null>(null);const [items,setItems]=useState<OrderItem[]>([]);const [error,setError]=useState("");const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);
 async function load(){if(!id)return;setLoading(true);try{const result=await ordersService.get(id);setOrder(result.order);setItems(result.items)}catch(err){setError(err instanceof Error?err.message:"Unable to load order details.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[id]);
 async function cancel(){if(!id||!window.confirm("Cancel this pending order?"))return;setBusy(true);try{await ordersService.cancel(id);await load()}catch(err){setError(err instanceof Error?err.message:"Unable to cancel order.")}finally{setBusy(false)}}
 if(loading)return <MainLayout><section className="route-panel"><p>Loading order…</p></section></MainLayout>;
 if(!order)return <MainLayout><section className="route-panel"><h1>Order unavailable.</h1><p>{error}</p><Link to="/orders">Back to orders</Link></section></MainLayout>;
 return <MainLayout><section className="order-detail-page"><Link to="/orders" className="auth-back">← Back to orders</Link><div className="order-detail-heading"><div><span className="eyebrow">ORDER DETAILS</span><h1>{order.order_number}</h1><p>{new Date(order.created_at).toLocaleString()}</p></div><Badge tone={order.status==="delivered"||order.status==="accepted"?"success":"orange"}>{order.status}</Badge></div><div className="order-detail-layout"><div className="order-items">{items.map(item=><article key={item.product_id}><div><b>{item.product_name}</b><small>Quantity: {item.quantity}</small></div><strong>{formatCurrency(item.line_total_piasters/100)}</strong></article>)}</div><aside className="checkout-summary"><h2>Delivery</h2><p>{order.recipient_name}<br/>{order.recipient_phone}<br/>{order.address_line}<br/>{order.area} {order.city}</p><div className="checkout-total"><span>Total</span><b>{formatCurrency(order.total_piasters/100)}</b></div><p>Payment: Cash on delivery · {order.payment_status}</p>{order.status==="pending"&&<button className="cancel-order" disabled={busy} onClick={()=>void cancel()}>{busy?"Cancelling…":"Cancel order"}</button>}</aside></div>{error&&<div className="auth-error">{error}</div>}</section></MainLayout>;
}
