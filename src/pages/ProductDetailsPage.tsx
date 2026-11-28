import {useEffect,useState} from "react";
import {Link,useParams,useNavigate} from "react-router-dom";
import ProductGallery from "../components/products/ProductGallery";
import RelatedProducts from "../components/products/RelatedProducts";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import type {Product} from "../types/product";
import {productsService} from "../services/products";
import {useAuth} from "../contexts/AuthContext";
import {useCart} from "../contexts/CartContext";
import Button from "../components/ui/Button";
import {formatCurrency} from "../utils/formatCurrency";
import {useLanguage} from "../contexts/LanguageContext";
export default function ProductDetailsPage(){
 const {id}=useParams();const navigate=useNavigate();const {user,loading:authLoading}=useAuth();const {addItem}=useCart();const {t}=useLanguage();
 const [product,setProduct]=useState<Product|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [changingOffer,setChangingOffer]=useState(false);
 useEffect(()=>{let active=true;if(!id){setLoading(false);return;}setLoading(true);productsService.get(id).then(value=>{if(active)setProduct(value)}).catch(err=>{if(active)setError(err instanceof Error?err.message:"Unable to load this listing.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[id]);
 async function selectOffer(offerId:string){if(!product||offerId===product.id)return;setChangingOffer(true);try{setProduct(await productsService.get(offerId));}catch(err){setError(err instanceof Error?err.message:"Could not load this offer.");}finally{setChangingOffer(false)}}
 if(loading)return <MainLayout><section className="route-panel"><p>{t("Loading product details…")}</p></section></MainLayout>;
 if(error||!product)return <MainLayout><section className="route-panel"><h1>{t("Listing unavailable")}</h1><p>{error||t("This product may have been removed.")}</p><Link className="ph-link-button" to="/cars">{t("Browse parts")}</Link></section></MainLayout>;
 const offers=product.offers||[{id:product.id,price:product.price,stockQuantity:product.stockStatus==="out-of-stock"?0:1,stockStatus:product.stockStatus}];
 return <MainLayout><section className="product-detail"><ProductGallery product={product}/><div className="detail-copy"><Badge>{t(product.category)}</Badge><h1>{product.name}</h1><p className="detail-fitment">{product.fitment}</p><h2>{formatCurrency(product.price)}</h2><p>{product.description}</p><div className="detail-seller"><b>{t("Seller")}</b><span>{t("Parts Hub")}</span></div><Badge tone={product.stockStatus==="in-stock"?"success":"neutral"}>{product.stockStatus==="in-stock"?t("Listed as in stock"):t("Currently unavailable")}</Badge>
 <section className="listing-offers"><h3>{t("Offers for this part")} ({offers.length})</h3><p>{t("Compare prices from different approved sellers. Seller identity and pickup address stay private.")}</p>{offers.slice().sort((a,b)=>a.price-b.price).map(offer=><button key={offer.id} className={offer.id===product.id?"offer-row selected":"offer-row"} onClick={()=>void selectOffer(offer.id)} disabled={changingOffer||offer.stockStatus==="out-of-stock"}><span>{offer.id===product.id?t("Selected offer"):t("Available offer")}</span><strong>{formatCurrency(offer.price)}</strong><small>{offer.stockStatus==="out-of-stock"?t("Out of stock"):t("In stock")}</small></button>)}</section>
 <p className="route-note">{t("Compatibility is not guaranteed by engine capacity alone. Confirm part number, engine code, year, transmission and trim before purchase.")}</p><div className="detail-actions"><Button disabled={product.stockStatus==="out-of-stock"||authLoading||changingOffer} onClick={()=>{if(!user){navigate("/login",{state:{from:"/cart"}});return;}addItem(product);navigate("/cart");}}>{t("Add to cart")}</Button><Button variant="secondary" disabled={product.stockStatus==="out-of-stock"||authLoading||changingOffer} onClick={()=>{if(!user){navigate("/login",{state:{from:"/checkout"}});return;}addItem(product);navigate("/checkout");}}>{t("Buy now")}</Button><Link className="ph-link-button" to="/cars">{t("Continue browsing")}</Link></div></div></section><RelatedProducts product={product}/></MainLayout>;
}
