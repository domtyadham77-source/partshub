import { useEffect,useState } from "react";
import type { Product } from "../../types/product";
import { productsService } from "../../services/products";
import ProductGrid from "./ProductGrid";
export default function RelatedProducts({product}:{product:Product}){
 const [items,setItems]=useState<Product[]>([]);
 useEffect(()=>{let active=true;productsService.list().then(all=>{if(active)setItems(all.filter(item=>item.id!==product.id&&item.category===product.category).slice(0,4))}).catch(()=>{if(active)setItems([])});return()=>{active=false}},[product.id,product.category]);
 if(!items.length)return null;
 return <section className="related-products"><div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Related listings</h2></div></div><ProductGrid products={items}/></section>;
}
