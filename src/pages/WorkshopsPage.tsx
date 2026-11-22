import { useEffect,useState } from "react";
import { MapPin,Phone,Wrench,Search } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import { workshopsService,type WorkshopProvider } from "../services/workshops";
const label=(type:string)=>type==="garage"?"Garage / workshop":type==="maintenance_center"?"Maintenance center":"Motorcycle workshop";
export default function WorkshopsPage(){
 const [items,setItems]=useState<WorkshopProvider[]>([]);const [city,setCity]=useState("");const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 async function load(){setLoading(true);setError("");try{setItems((await workshopsService.list(city.trim())).items)}catch(err){setError(err instanceof Error?err.message:"Unable to load workshop providers.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 return <MainLayout><section className="workshops-page"><span className="eyebrow">LOCAL AUTOMOTIVE EXPERTS</span><h1>Garages & workshops.</h1><p>Find approved garages, maintenance centers, and motorcycle workshops listed on Parts Hub.</p><div className="workshop-search"><Input label="City or governorate" name="workshop-city" value={city} onChange={e=>setCity(e.target.value)} placeholder="Search by city"/><button onClick={()=>void load()}><Search size={15}/> Search</button></div>{error&&<div className="auth-error">{error}</div>}{loading?<div className="catalog-state">Finding providers…</div>:items.length===0?<div className="cart-empty"><Wrench size={40}/><h2>No approved providers yet</h2><p>We're onboarding trusted automotive service providers. Check back soon.</p><a className="ph-link-button" href="/register">Register a workshop</a></div>:<div className="workshop-provider-grid">{items.map(item=><article key={item.id}><div className="provider-icon"><Wrench size={24}/></div><Badge>{label(item.business_type)}</Badge><h2>{item.store_name}</h2><p>{item.description||"Approved Parts Hub service provider."}</p><div><MapPin size={14}/>{[item.address_line,item.area,item.city].filter(Boolean).join(", ")||"Location not provided"}</div>{item.contact_phone&&<a href={`tel:${item.contact_phone}`}><Phone size={14}/>{item.contact_phone}</a>}</article>)}</div>}</section></MainLayout>;
}
