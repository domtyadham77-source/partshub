import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { Star } from "lucide-react";
import ProductGallery from "../components/products/ProductGallery";
import RelatedProducts from "../components/products/RelatedProducts";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import type { Product } from "../types/product";
import { productsService } from "../services/products";
import { formatCurrency } from "../utils/formatCurrency";
export default function ProductDetailsPage(){
 const {id}=useParams();const [product,setProduct]=useState<Product|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{let active=true;if(!id){setLoading(false);return;}setLoading(true);productsService.get(id).then(value=>{if(active)setProduct(value)}).catch(err=>{if(active)setError(err instanceof Error?err.message:"Unable to load this listing.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[id]);
 if(loading)return <MainLayout><section className="route-panel"><p>Loading product details…</p></section></MainLayout>;
 if(error||!product)return <MainLayout><section className="route-panel"><h1>Listing unavailable</h1><p>{error||"This product may have been removed."}</p><Link className="ph-link-button" to="/cars">Browse parts</Link></section></MainLayout>;
 return <MainLayout><section className="product-detail"><ProductGallery product={product}/><div className="detail-copy"><Badge>{product.category}</Badge><h1>{product.name}</h1><p className="detail-fitment">{product.fitment}</p>{product.rating&&product.rating>0?<div className="detail-rating"><Star size={15} fill="currentColor"/> {product.rating.toFixed(1)} <span>Seller rating</span></div>:null}<h2>{formatCurrency(product.price)}</h2><p>{product.description}</p><div className="detail-seller"><b>Seller</b><span>{product.seller}</span></div><Badge tone={product.stockStatus==="in-stock"?"success":"neutral"}>{product.stockStatus==="in-stock"?"Listed as in stock":"Currently unavailable"}</Badge><p className="route-note">Confirm compatibility, final price, availability, warranty, and return terms with the seller before purchase.</p><Link className="ph-link-button" to="/">Continue browsing</Link></div></section><RelatedProducts product={product}/></MainLayout>;
}
