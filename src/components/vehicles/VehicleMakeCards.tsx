import {Link} from "react-router-dom";
import {ArrowUpRight} from "lucide-react";
import {useLanguage} from "../../contexts/LanguageContext";
import {vehicleCatalog} from "../../data/vehicleCatalog";

const photos:Record<string,string>={
 "chevrolet":"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
 "hyundai":"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
 "mercedes-benz":"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
 "opel":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85"
};
const extraMakes=[{id:"opel",name:"Opel"}];

export default function VehicleMakeCards({compact=false}:{compact?:boolean}){
 const {t}=useLanguage();
 const makes=[...vehicleCatalog,...extraMakes.filter(x=>!vehicleCatalog.some(m=>m.id===x.id))];
 return <div className={`vehicle-card-grid make-card-grid ${compact?"make-card-grid-compact":""}`}>
  {makes.map((make,index)=>{
   const image=photos[make.id]||photos["chevrolet"];
   const hasModels=!!vehicleCatalog.find(x=>x.id===make.id)?.models.length;
   return <Link key={make.id} data-global-reveal data-scroll-reveal className="vehicle-card make-card" to={`/cars?make=${make.id}`}>
    <img src={image} alt={t(make.name)+ " vehicle"} loading="lazy"/>
    <span className="vehicle-card-shade"/>
    <span className="vehicle-card-copy"><small>{String(index+1).padStart(2,"0")} / {t("MANUFACTURER")}</small><strong>{t(make.name)}</strong><em>{hasModels?t("Choose a model and year"):t("Verified vehicle data coming soon")}</em></span>
    <ArrowUpRight className="vehicle-card-arrow" size={20}/>
   </Link>;
  })}
 </div>;
}
