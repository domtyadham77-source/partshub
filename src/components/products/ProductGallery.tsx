import {useState} from "react";
import {Bike,CarFront,Wrench} from "lucide-react";
import type {Product} from "../../types/product";
import "./ProductGallery.css";
export default function ProductGallery({product}:{product:Product}){
 const Icon=product.category==="Motorcycle parts"?Bike:product.category==="Workshop"?Wrench:CarFront;
 const images=product.imageUrls?.length?product.imageUrls:product.imageUrl?[product.imageUrl]:[];
 const [active,setActive]=useState(0);
 const current=images[Math.min(active,Math.max(0,images.length-1))];
 return <div className="detail-visual product-gallery">{current?<><img className="gallery-main-image" src={current} alt={product.name}/>{images.length>1&&<div className="gallery-thumbnails">{images.map((src,i)=><button key={src} className={i===active?"active":""} onClick={()=>setActive(i)} aria-label={`View product photo ${i+1}`}><img src={src} alt=""/></button>)}</div>}</>:<div className="product-gallery-placeholder"><Icon size={120} strokeWidth={1}/><span>PRODUCT IMAGE</span></div>}</div>;
}
