import {Link} from "react-router-dom";
import {ArrowUpRight} from "lucide-react";
import {useLanguage} from "../../contexts/LanguageContext";
import {vehicleCatalog} from "../../data/vehicleCatalog";

const photos:Record<string,string>={
 "chevrolet":"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
 "hyundai":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85",
 "mercedes-benz":"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
 "opel":"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85",
 "kia":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85",
 "nissan":"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85",
 "toyota":"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=85",
 "mitsubishi":"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85",
 "renault":"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
 "peugeot":"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
 "fiat":"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85",
 "suzuki":"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
 "skoda":"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85",
 "volkswagen":"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
 "mg":"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85",
 "chery":"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=85",
 "geely":"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
 "byd":"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=85",
 "jac":"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85",
 "isuzu":"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85"
};
const extraMakes=[
 {id:"chevrolet",name:"Chevrolet"},{id:"hyundai",name:"Hyundai"},{id:"kia",name:"Kia"},{id:"nissan",name:"Nissan"},
 {id:"toyota",name:"Toyota"},{id:"mitsubishi",name:"Mitsubishi"},{id:"renault",name:"Renault"},{id:"peugeot",name:"Peugeot"},
 {id:"fiat",name:"Fiat"},{id:"opel",name:"Opel"},{id:"suzuki",name:"Suzuki"},{id:"skoda",name:"Škoda"},
 {id:"volkswagen",name:"Volkswagen"},{id:"mg",name:"MG"},{id:"chery",name:"Chery"},{id:"geely",name:"Geely"},
 {id:"byd",name:"BYD"},{id:"jac",name:"JAC"},{id:"isuzu",name:"Isuzu"},{id:"mercedes-benz",name:"Mercedes-Benz"}
];

export default function VehicleMakeCards({compact=false}:{compact?:boolean}){
 const {t}=useLanguage();
 const makes=extraMakes;
 return <div className={`vehicle-card-grid make-card-grid ${compact?"make-card-grid-compact":""}`}>
  {makes.map((make,index)=>{
   const image=photos[make.id]||photos["hyundai"];
   const hasModels=!!vehicleCatalog.find(x=>x.id===make.id)?.models.length;
   return <Link key={make.id} data-scroll-reveal className="vehicle-card make-card" to={`/cars?make=${make.id}`}>
    <img src={image} alt={t(make.name)+ " representative vehicle"} loading="lazy"/>
    <span className="vehicle-card-shade"/>
    <span className="vehicle-card-copy"><small>{String(index+1).padStart(2,"0")} / {t("MANUFACTURER")}</small><strong>{t(make.name)}</strong><em>{hasModels?t("Choose a model and year"):t("Verified vehicle data coming soon")}</em></span>
    <ArrowUpRight className="vehicle-card-arrow" size={20}/>
   </Link>;
  })}
 </div>;
}
