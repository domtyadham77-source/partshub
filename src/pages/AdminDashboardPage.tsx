import { useEffect,useState } from "react";
import { Users,Store,Package,ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { adminService } from "../services/admin";
export default function AdminDashboardPage(){
 const [stats,setStats]=useState<{users:number;pendingMerchants:number;products:number}|null>(null);const [error,setError]=useState("");
 useEffect(()=>{adminService.overview().then(setStats).catch(err=>setError(err instanceof Error?err.message:"Unable to load admin overview."))},[]);
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">CONTROL CENTER</span><h1>Marketplace overview.</h1><p>Monitor platform activity and review seller access.</p>{error&&<div className="auth-error">{error}</div>}<div className="admin-stat-grid"><article><Users/><span>Total accounts</span><b>{stats?stats.users:"—"}</b></article><article><Store/><span>Pending merchants</span><b>{stats?stats.pendingMerchants:"—"}</b></article><article><Package/><span>Product listings</span><b>{stats?stats.products:"—"}</b></article></div><div className="admin-action-list"><Link className="admin-action-link" to="/admin/merchants">Review merchant applications <ArrowUpRight size={16}/></Link><Link className="admin-action-link" to="/admin/products">Review product listings <ArrowUpRight size={16}/></Link><Link className="admin-action-link" to="/admin/users">Manage user accounts <ArrowUpRight size={16}/></Link><Link className="admin-action-link" to="/admin/orders">View marketplace orders <ArrowUpRight size={16}/></Link></div><Badge tone="neutral">Admin tools are available only to manually promoted administrator accounts.</Badge></section></MainLayout>;
}
