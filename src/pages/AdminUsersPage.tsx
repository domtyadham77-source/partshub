import { useEffect,useState } from "react";
import { Search,RefreshCw,ShieldAlert } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { adminService } from "../services/admin";
type UserRow={id:string;full_name:string;email:string;phone:string|null;role:string;status:string;created_at:string};
export default function AdminUsersPage(){
 const [items,setItems]=useState<UserRow[]>([]);const [q,setQ]=useState("");const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [busy,setBusy]=useState("");
 async function load(){setLoading(true);setError("");try{setItems((await adminService.users(q)).items)}catch(err){setError(err instanceof Error?err.message:"Unable to load users.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 async function suspend(user:UserRow){if(user.status==="suspended"||user.role==="admin")return;if(!window.confirm(`Suspend ${user.full_name}'s account?`))return;setBusy(user.id);try{await adminService.setUserStatus(user.id,"suspended");await load()}catch(err){setError(err instanceof Error?err.message:"Unable to update account.")}finally{setBusy("")}}
 return <MainLayout><section className="admin-dashboard"><span className="eyebrow">ACCOUNT MANAGEMENT</span><h1>Marketplace users.</h1><div className="admin-user-search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void load()}} placeholder="Search name or email"/></div>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Loading users…</div>:<div className="admin-user-list">{items.map(user=><article key={user.id}><div><b>{user.full_name}</b><small>{user.email} · {user.phone||"No phone"}</small><span>{user.role} · Joined {new Date(user.created_at).toLocaleDateString()}</span></div><div><Badge tone={user.status==="active"?"success":"neutral"}>{user.status}</Badge>{user.role!=="admin"&&user.status!=="suspended"&&<button disabled={busy===user.id} onClick={()=>void suspend(user)}><ShieldAlert size={14}/> Suspend</button>}</div></article>)}</div>}<button className="admin-refresh" onClick={()=>void load()}><RefreshCw size={14}/> Refresh</button></section></MainLayout>;
}
