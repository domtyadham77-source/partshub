import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import ProductGrid from "../components/products/ProductGrid";
import VehicleMakeCards from "../components/vehicles/VehicleMakeCards";
import type {Product} from "../types/product";
import {productsService} from "../services/products";
import {vehicleCatalog} from "../data/vehicleCatalog";
import {useLanguage} from "../contexts/LanguageContext";
import "../styles/catalog.css";

const modelPhotos:Record<string,string>={
 "aveo":"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
 "elantra-ad":"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
 "c-class-w205-c180":"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85"
};
export default function CarsPage(){
 const {t}=useLanguage();
 const [params,setParams]=useSearchParams();
 const [makeId,setMakeId]=useState(params.get("make")||"");
 const make=vehicleCatalog.find(x=>x.id===makeId);
 const [modelId,setModelId]=useState("");
 const model=make?.models.find(x=>x.id===modelId);
 const [year,setYear]=useState<number|null>(null);
 const [engineIndex,setEngineIndex]=useState<number|null>(null);
 const [transmission,setTransmission]=useState("");
 const [trim,setTrim]=useState("");
 const [query,setQuery]=useState("");
 const [items,setItems]=useState<Product[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const paramMake=params.get("make")||"";
 useEffect(()=>{if(paramMake!==makeId){setMakeId(paramMake);setModelId("");setYear(null);setEngineIndex(null);setTransmission("");setTrim("");setQuery("");}},[paramMake]);
 useEffect(()=>{let active=true;productsService.list().then(x=>{if(active)setItems(x)}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Unable to load listings.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const years=useMemo(()=>model?Array.from({length:model.years[1]-model.years[0]+1},(_,i)=>model.years[1]-i):[],[model]);
 const availableEngines=model?.engines.filter(x=>year!==null&&year>=x.years[0]&&year<=x.years[1])||[];
 const engine=availableEngines.length===1?availableEngines[0]:availableEngines[engineIndex??0];
 const transmissions=engine?.transmissions||[];
 const trims=engine?.trims||[];
 const engineRequired=availableEngines.length>1;
 const vehicleComplete=!!(make&&model&&year!==null&&engine&&(!engineRequired||engineIndex!==null)&&(!transmissions.length||transmissions.length===1||transmission)&&(!trims.length||trims.length===1||trim));
 const visible=useMemo(()=>{
  if(!vehicleComplete||!make||!model||!engine||year===null)return[];
  const norm=(s:string)=>s.toLowerCase().replace(/[–—]/g,"-").replace(/\s+/g," ").trim();
  const needle=query.trim().toLowerCase();
  const found=items.filter(p=>{
   const f=norm(p.fitment);
   if(!f.includes(norm(make.name))||!f.includes(norm(model.name.split(" · ")[0])))return false;
   const range=f.match(/(19\d{2}|20\d{2})\s*[-–—]\s*(19\d{2}|20\d{2})/);
   if(range&&(year<Number(range[1])||year>Number(range[2])))return false;
   if(/\b(19\d{2}|20\d{2})\b/.test(f)&&!range&&!f.includes(String(year)))return false;
   if(needle&&!norm([p.name,p.fitment,p.description].join(" ")).includes(needle))return false;
   const cc=f.match(/(\d{3,4})\s*cc/i);
   const litre=f.match(/(\d+(?:\.\d+)?)\s*(?:l|litre|liter)\b/i);
   const listingHasEngine=!!(cc||litre||engine.code&&f.includes(engine.code.toLowerCase()));
   if(cc&&Number(cc[1])!==engine.cc)return false;
   if(!cc&&litre&&Math.abs(Number(litre[1])*1000-engine.cc)>30)return false;
   if(engine.code&&listingHasEngine&&!f.includes(engine.code.toLowerCase()))return false;
   const chosenTransmission=(transmission||transmissions[0]||"").toLowerCase().match(/manual|automatic|cvt|dct/)?.[0];
   const listingTransmission=f.match(/\b(manual|automatic|cvt|dct)\b/i)?.[1]?.toLowerCase();
   if(listingTransmission&&chosenTransmission&&listingTransmission!==chosenTransmission)return false;
   if(trim&&trim!=="Any trim"&&f.match(/\b(baseline|modern|topline|ls|lt|ltz)\b/i)&&!f.includes(trim.toLowerCase()))return false;
   return true;
  });
  const grouped=new Map<string,Product>();
  for(const p of found){const key=(p.name+"|"+p.fitment).toLowerCase();const old=grouped.get(key);if(!old||p.price<old.price)grouped.set(key,p);}
  return [...grouped.values()].sort((a,b)=>a.price-b.price);
 },[items,make,model,year,engine,query,transmission,trim,vehicleComplete]);
 function chooseModel(id:string){
  const next=make?.models.find(x=>x.id===id);
  setModelId(id);setYear(next&&next.years[0]===next.years[1]?next.years[0]:null);setEngineIndex(null);setTransmission("");setTrim("");
 }
 function chooseYear(value:number){
  const engines=model?.engines.filter(x=>value>=x.years[0]&&value<=x.years[1])||[];
  setYear(value);setEngineIndex(engines.length>1?null:0);setTransmission(engines.length===1&&engines[0].transmissions.length===1?engines[0].transmissions[0]:"");setTrim(engines.length===1&&(engines[0].trims||[]).length===1?engines[0].trims?.[0]||"": "");
 }
 function chooseEngine(index:number){
  const next=availableEngines[index];setEngineIndex(index);setTransmission(next?.transmissions.length===1?next.transmissions[0]:"");setTrim((next?.trims||[]).length===1?next?.trims?.[0]||"": "");
 }
 function resetMake(){setMakeId("");setParams({});setModelId("");setYear(null);setEngineIndex(null);setTransmission("");setTrim("");}
 const unsupported=!!makeId&&!make;
 return <MainLayout><section className="catalog-route vehicle-catalog">
  <Badge>{t("PARTS HUB VEHICLE FINDER")}</Badge>
  <h1>{t("Find parts for your exact vehicle.")}</h1>
  <p>{t("Choose with picture cards. We only show parts that match the selected vehicle details.")}</p>
  <div className="vehicle-step" id="vehicle-make-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 1")}</span><h2>{t("Choose manufacturer")}</h2></div>{makeId&&<button className="vehicle-back-button" onClick={resetMake}>{t("Change make")}</button>}</div>
   {!makeId&&<VehicleMakeCards compact/>}
   {make&&<div className="vehicle-choice-summary"><strong>{t(make.name)}</strong><span>{t("Manufacturer selected. Continue by choosing the model below.")}</span></div>}
   {unsupported&&<div className="vehicle-catalog-empty"><strong>{t(makeId==="opel"?"Opel":"Manufacturer")} · {t("Verified catalogue is being expanded")}</strong>{t("We are checking exact model, year and engine specifications before enabling compatibility. No parts will be shown as compatible until this data is verified.")}</div>}
  </div>
  {make&&<div className="vehicle-step" id="vehicle-model-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 2")}</span><h2>{t("Choose model")}</h2></div></div>
   <div className="vehicle-card-grid model-card-grid">
    {make.models.map((item,index)=><button key={item.id} className={`vehicle-card model-card ${modelId===item.id?"selected":""}`} onClick={()=>chooseModel(item.id)}>
     <img src={modelPhotos[item.id]||modelPhotos["aveo"]} alt={item.name+" vehicle"} loading="lazy"/><span className="vehicle-card-shade"/><span className="vehicle-card-copy"><small>{String(index+1).padStart(2,"0")} / {t("MODEL")}</small><strong>{t(item.name)}</strong><em>{item.years[0]} – {item.years[1]} · {t(item.generation||item.name)}</em></span>
    </button>)}
   </div>
  </div>}
  {model&&<div className="vehicle-step" id="vehicle-year-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 3")}</span><h2>{t("Choose model year")}</h2></div><p>{t(model.name)} · {model.years[0]}–{model.years[1]}</p></div>
   {years.length===1?<div className="vehicle-choice-summary"><strong>{year}</strong><span>{t("Only one model year is listed for this catalog entry.")}</span></div>:<div className="vehicle-card-grid year-card-grid">{years.map(y=><button key={y} className={`year-card ${year===y?"selected":""}`} onClick={()=>chooseYear(y)}>{y}</button>)}</div>}
  </div>}
  {model&&year!==null&&availableEngines.length>0&&<div className="vehicle-step" id="vehicle-engine-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 4")}</span><h2>{t("Choose engine")}</h2></div><p>{t("Engine size in cc")}</p></div>
   {availableEngines.length===1?<div className="vehicle-choice-summary"><strong>{t(availableEngines[0].label)}</strong><span>{t("Only one verified engine is listed for this model year; it is selected automatically.")}</span></div>:<div className="vehicle-card-grid engine-card-grid">{availableEngines.map((e,i)=><button key={e.code||e.cc+"-"+i} className={`engine-choice ${engineIndex===i?"selected":""}`} onClick={()=>chooseEngine(i)}><strong>{t(e.label)}</strong><span>{e.cc} cc{e.code?" · "+e.code:""}<br/>{t(e.fuel)} · {e.years[0]}–{e.years[1]}</span></button>)}</div>}
  </div>}
  {engine&&year!==null&&transmissions.length>1&&<div className="vehicle-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 5")}</span><h2>{t("Choose transmission")}</h2></div></div>
   <div className="vehicle-card-grid engine-card-grid">{transmissions.map(x=><button key={x} className={`engine-choice ${transmission===x?"selected":""}`} onClick={()=>setTransmission(x)}><strong>{t(x)}</strong><span>{t("Select the exact transmission fitted to your vehicle.")}</span></button>)}</div>
  </div>}
  {engine&&year!==null&&trims.length>1&&<div className="vehicle-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("STEP 6")}</span><h2>{t("Choose trim")}</h2></div></div>
   <div className="vehicle-card-grid engine-card-grid">{trims.map(x=><button key={x} className={`engine-choice ${trim===x?"selected":""}`} onClick={()=>setTrim(x)}><strong>{t(x)}</strong></button>)}</div>
  </div>}
  {vehicleComplete&&make&&model&&engine&&year!==null&&<div className="vehicle-choice-summary"><strong>{t("Your selected vehicle")}: {t(make.name)} {t(model.name)} · {year}</strong><span>{t(engine.label)} · {engine.cc} cc · {t(transmission||transmissions[0]||"Transmission not specified")} · {t(trim||trims[0]||"Trim not specified")}</span><small>{t("For safety, confirm the part number and engine code with the seller when the listing does not show complete fitment details.")}</small></div>}
  {vehicleComplete&&<div className="vehicle-step" id="vehicle-parts-step">
   <div className="vehicle-step-heading"><div><span className="vehicle-step-kicker">{t("MATCHED PARTS")}</span><h2>{t("Parts for your vehicle")}</h2></div><p>{loading?t("Loading listings…"):`${visible.length} ${t("matching listings")}`}</p></div>
   <div className="catalog-controls"><label className="catalog-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("Search parts in this vehicle")} aria-label={t("Search parts in this vehicle")}/></label></div>
   {loading?<div className="catalog-state">{t("Loading products…")}</div>:error?<div className="catalog-state catalog-error" role="alert">{error}</div>:visible.length?<ProductGrid products={visible}/>:<div className="vehicle-catalog-empty"><strong>{t("No parts listed for this exact vehicle yet")}</strong>{t("This space will show seller listings when merchants add compatible parts. No sample or unrelated parts are shown.")}</div>}
  </div>}
  {engine?.source&&<p className="vehicle-source-note">{t("Engine specifications source")}: <a href={engine.source} target="_blank" rel="noreferrer">{t("Open reference")}</a></p>}
  <p className="vehicle-coverage-note">{t("The vehicle catalogue is currently a verified sample and will expand. Never assume compatibility from displacement alone; check the exact part number, engine code, transmission and production variant.")}</p>
 </section></MainLayout>;
}
