import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProductGrid from "../components/products/ProductGrid";
import { products } from "../data/products";
import { useFavorites } from "../contexts/FavoritesContext";
export default function FavoritesPage(){
 const {ids,clear}=useFavorites();const saved=products.filter(product=>ids.includes(product.id));
 return <MainLayout><section className="catalog-route"><span className="eyebrow">YOUR GARAGE LIST</span><h1>Saved parts.</h1><p>Keep the parts you want to compare close at hand.</p>{saved.length?<><div className="results-line"><span>{saved.length} saved listings</span><button className="clear-favorites" onClick={clear}>Clear saved list</button></div><ProductGrid products={saved}/></>:<div className="cart-empty"><h2>No saved parts yet</h2><p>Tap the heart on a product to save it here.</p><Link className="ph-link-button" to="/">Explore marketplace</Link></div>}</section></MainLayout>;
}
