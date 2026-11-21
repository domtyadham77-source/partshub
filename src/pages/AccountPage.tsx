import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
export default function AccountPage(){
 const {user,loading,logout}=useAuth();
 if(loading)return <MainLayout><section className="route-panel"><p>Loading your account…</p></section></MainLayout>;
 if(!user)return <MainLayout><section className="route-panel"><Badge>ACCOUNT</Badge><h1>Sign in to continue.</h1><p>Your profile and orders are available after signing in.</p><Link className="ph-link-button" to="/login">Sign in</Link></section></MainLayout>;
 return <MainLayout><section className="route-panel"><Badge>{user.role.toUpperCase()}</Badge><h1>Hello, {user.fullName.split(" ")[0]}.</h1><p>{user.email}</p><p>Account status: {user.status}</p><div className="route-links"><Link to="/orders">My orders</Link><Link to="/favorites">Saved parts</Link>{user.role==="merchant"&&<Link to="/merchant">Seller workspace</Link>}{user.role==="admin"&&<Link to="/admin">Admin dashboard</Link>}</div><Button variant="secondary" onClick={()=>void logout()}>Sign out</Button></section></MainLayout>;
}
