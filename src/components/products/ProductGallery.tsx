import { Bike,CarFront,Wrench } from "lucide-react";
import type { Product } from "../../types/product";
import "./ProductGallery.css";
import "./ProductGallery.css";
export default function ProductGallery({product}:{product:Product}){
 const Icon=product.category==="Motorcycle parts"?Bike:product.category==="Workshop"?Wrench:CarFront;
 return <div className="detail-visual product-gallery">{product.imageUrl?<img src={product.imageUrl} alt={product.name}/>:<div className="product-gallery-placeholder"><Icon size={120} strokeWidth={1}/><span>PRODUCT IMAGE</span></div>}</div>;
}
