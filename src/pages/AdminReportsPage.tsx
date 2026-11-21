import { useEffect,useState } from "react";
import { ShoppingBag,Store,LifeBuoy,Wallet,CheckCircle2,Clock3 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { adminService } from "../services/admin";
import { formatCurrency } from "../utils/formatCurrency";
type Stats={orderCount:number;grossOrderValuePiasters:number;paidOrderValuePiasters:number;pendingOrders:number;deliveredOrders:number;activeMerchants:number;openSupportTickets:number};
export default function AdminReportsPage(){
 const [stats,setStats]=useState<Stats|null>(null);const [error,setError]=useState("");
 useEffect(()=>{adminService.reports().then(setStats).catch(err=>setError(err instanceof Error?err.message:"Unable to load reports."))},[]);
 const cards=[{label:"All orders",value:stats?.orderCount,icon:ShoppingBag},{label:"Gross order value",value:stats?formatCurrency(stats.grossOrderValuePiasters/100):"—",icon:Wallet},{label:"Paid order value",value:stats?formatCurrency(stats.paidOrderValuePiasters/100):"—",icon:CheckCircle2},{label:"Pending orders",value:stats?.pendingOrders,icon:Clock3},{label:"Delivered orders",value:stats?.deliveredOrders,icon:ShoppingBag},{label:"Active merchants",value:stats?.activeMerchants,icon:Store},{label:"Open support tickets",value:stats?.openSupportTickets,icon:LifeBuoy}];
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">PLATFORM INSIGHTS</span><h1>Marketplace reports.</h1><p>Operational totals from the current Preview database. Gross order value is not the same as collected revenue.</p>{error&&<div className="auth-error">{error}</div>}<div className="admin-stat-grid">{cards.map(card=><article key={card.label}><card.icon/><span>{card.label}</span><b>{card.value??"—"}</b></article>)}</div></section></MainLayout>;
}
