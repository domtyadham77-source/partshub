import {useEffect,useMemo,useState} from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import ProductGrid from "../components/products/ProductGrid";
import type {Product} from "../types/product";
import {productsService} from "../services/products";
import {vehicleCatalog} from "../data/vehicleCatalog";
import {useLanguage} from "../contexts/LanguageContext";
import "../styles/catalog.css";

export default function CarsPage(){
 const {t}=useLanguage();
 const [makeId,setMakeId]=useState(vehicleCatalog[0]?.id||"");
 const make=vehicleCatalog.find(x=>x.id===makeId)||vehicleCatalog[0];
 const [modelId,setModelId]=useState(make?.models[0]?.id||"");
 const model=make?.models.find(x=>x.id===modelId)||make?.models[0];
 const [year,setYear]=useState(model?.years[1]||new Date().getFullYear());
 const [engineIndex,setEngineIndex]=useState(0);
 const engine=model?.engines[engineIndex]||model?.engines[0];
 const [query,setQuery]=useState("");
 const [items,setItems]=useState<Product[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{let active=true;productsService.list().then(x=>{if(active)setItems(x)}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Unable to load listings.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const years=useMemo(()=>model?Array.from({length:model.years[1]-model.years[0]+1},(_,i)=>model.years[1]-i):[],[model]);
 const visible=useMemo(()=>{
  if(!make||!model)return[];
  const norm=(s:string)=>s.toLowerCase().replace(/[–—]/g,"-");
  const needle=query.trim().toLowerCase();
  const matching=items.filter(p=>{
   const f=norm(p.fitment);
   const vehicleMatch=f.includes(norm(make.name))&&f.includes(norm(model.name.split(" · ")[0]));
   if(!vehicleMatch)return false;
   const range=f.match(/(20\d{2})\s*[-–—]\s*(20\d{2})/);
   if(range&&(year<Number(range[1])||year>Number(range[2])))return false;
   if(needle&&!norm([p.name,p.fitment,p.description].join(" ")).includes(needle))return false;
   // If a listing explicitly specifies displacement or engine code, require an exact match.
   const cc=f.match(/(\d{3,4})\s*cc/i);
   if(cc&&engine&&Number(cc[1])!==engine.cc)return false;
   if(engine?.code&&!f.includes(engine.code.toLowerCase()))return false;
   return true;
  });
  const groups=new Map<string,Product>();
  for(const p of matching){const key=(p.name+"|"+p.fitment).toLowerCase();const old=groups.get(key);if(!old||p.price<old.price)groups.set(key,p);}
  return [...groups.values()].sort((a,b)=>a.price-b.price);
 },[items,make,model,year,engine,query]);
 function changeMake(value:string){const next=vehicleCatalog.find(x=>x.id===value);setMakeId(value);setModelId(next?.models[0]?.id||"");setYear(next?.models[0]?.years[1]||new Date().getFullYear());setEngineIndex(0);}
 function changeModel(value:string){const next=make?.models.find(x=>x.id===value);setModelId(value);setYear(next?.years[1]||new Date().getFullYear());setEngineIndex(0);}
 return <MainLayout><section className="catalog-route vehicle-catalog">
  <Badge>{t("PARTS HUB VEHICLE FINDER")}</Badge><h1>{t("Choose your vehicle.")}</h1><p>{t("Select make, model, year and engine to narrow down parts.")}</p>
  <div className="vehicle-select-panel">
   <label><span>{t("Make")}</span><select value={makeId} onChange={e=>changeMake(e.target.value)}>{vehicleCatalog.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
   <label><span>{t("Model")}</span><select value={modelId} onChange={e=>changeModel(e.target.value)}>{make?.models.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
   <label><span>{t("Model year")}</span><select value={year} onChange={e=>setYear(Number(e.target.value))}>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
   <label><span>{t("Engine")}</span><select value={engineIndex} onChange={e=>changeEngine(Number(e.target.value))}>{model?.engines.map((x,i)=><option key={i} value={i}>{x.label}</option>)}</select></label>
  </div>
  <div className="vehicle-selection-note"><strong>{make?.name} {model?.name} · {year}</strong><span>{engine?.code? t("Engine code")+": "+engine.code:""} {engine?.fuel} · {transmission} · {trim}</span><small>{t("Fitment is market- and variant-specific. Listings without engine code or exact displacement require confirmation before purchase.")}</small></div>
  <div className="catalog-controls"><label className="catalog-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("Search parts in this vehicle")} aria-label={t("Search parts in this vehicle")}/></label></div>
  <div className="results-line"><span>{loading?t("Loading listings…"):`${visible.length} ${t("matching listings")}`}</span><span>{t("Price comparison · lowest first")}</span></div>
  {loading?<div className="catalog-state">{t("Loading products…")}</div>:error?<div className="catalog-state catalog-error" role="alert">{error}</div>:<ProductGrid products={visible}/>}
  {engine?.source&&<p className="vehicle-source-note">{t("Engine specifications source")}: <a href={engine.source} target="_blank" rel="noreferrer">{t("Open reference")}</a></p>}
  <p className="vehicle-source-note">{t("Catalog coverage is being expanded using regional vehicle data. Do not assume compatibility from displacement alone; compare part number, engine code, transmission and production variant.")}</p>
 </section></MainLayout>;
}
