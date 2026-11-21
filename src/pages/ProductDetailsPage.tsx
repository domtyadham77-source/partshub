import { Link, useParams } from "react-router-dom";
import { Bike, CarFront, Wrench, Star } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { products } from "../data/products";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductDetailsPage() {
 const { id }=useParams(); const product=products.find(item=>item.id===id);
 if(!product) return <MainLayout><section className="route-panel"><h1>Listing not found</h1><p>This sample listing may have been removed.</p><Link className="ph-link-button" to="/">Back to marketplace</Link></section></MainLayout>;
 const Icon=product.category==="Motorcycle parts"?Bike:product.category==="Workshop"?Wrench:CarFront;
 return <MainLayout><section className="product-detail"><div className="detail-visual"><Icon size={120} strokeWidth={1}/></div><div className="detail-copy"><Badge>{product.category}</Badge><h1>{product.name}</h1><p className="detail-fitment">{product.fitment}</p><div className="detail-rating"><Star size={15} fill="currentColor"/> {product.rating.toFixed(1)} <span>Seller rating preview</span></div><h2>{formatCurrency(product.price)}</h2><p>{product.description}</p><div className="detail-seller"><b>Seller</b><span>{product.seller}</span></div><Badge tone={product.stockStatus==="in-stock"?"success":"neutral"}>{product.stockStatus==="in-stock"?"Listed as in stock":product.stockStatus==="limited"?"Limited stock":"Out of stock"}</Badge><p className="route-note">Preview listing only. Confirm compatibility, final price, availability, warranty, and return terms with the seller before purchase.</p><Link className="ph-link-button" to="/">Continue browsing</Link></div></section></MainLayout>;
}
