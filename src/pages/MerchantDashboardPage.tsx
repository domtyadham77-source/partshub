import { Link } from "react-router-dom";
import { Boxes,ClipboardList,Store,ShieldCheck,ArrowUpRight } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { useAuth } from "../contexts/AuthContext";
export default function MerchantDashboardPage(){
 const {user}=useAuth();
 if(!user)return null;
 if(user.status==="pending")return <MainLayout><section className="merchant-pending"><div className="merchant-status-icon"><ShieldCheck size={28}/></div><Badge tone="orange">REVIEW IN PROGRESS</Badge><h1>Your seller account is being reviewed.</h1><p>Thanks for joining Parts Hub. Your account is saved, but seller tools stay locked until the team reviews and approves your merchant profile.</p><div className="merchant-review-steps"><span className="done">Account created</span><span>Business verification</span><span>Seller access enabled</span></div><Link to="/account" className="ph-link-button">Back to my account</Link></section></MainLayout>;
 if(user.status!=="active")return <MainLayout><section className="route-panel"><Badge tone="neutral">ACCOUNT STATUS</Badge><h1>Seller access is unavailable.</h1><p>Please contact support for help with your account.</p></section></MainLayout>;
 return <MainLayout><section className="merchant-dashboard"><div className="merchant-heading"><div><span className="eyebrow">SELLER WORKSPACE</span><h1>Good to see you, {user.fullName.split(" ")[0]}.</h1><p>Manage your marketplace presence from one place.</p></div><Badge tone="success">SELLER ACTIVE</Badge></div><div className="merchant-stat-grid"><article><Boxes/><span>Active listings</span><b>—</b><small>Inventory connection pending</small></article><article><ClipboardList/><span>Open orders</span><b>—</b><small>Order service pending</small></article><article><Store/><span>Store profile</span><b>Setup</b><small>Merchant profile module next</small></article></div><div className="merchant-next"><h2>Seller tools</h2><p>Your account is approved. Inventory and order management are the next modules being connected.</p><Link to="/merchant/products">Manage products <ArrowUpRight size={15}/></Link><Link to="/merchant/orders">View orders <ArrowUpRight size={15}/></Link></div></section></MainLayout>;
}
