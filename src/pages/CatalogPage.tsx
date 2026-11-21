import { useEffect,useMemo,useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import type { Product,ProductCategory } from "../types/product";
import { productsService } from "../services/products";
import Badge from "../components/ui/Badge";

export default function CatalogPage({ initialCategory = "All" }: { initialCategory?: ProductCategory|"All" }) {
 const [query,setQuery]=useState("");const [category,setCategory]=useState<ProductCategory|"All">(initialCategory);const [items,setItems]=useState<Product[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 async function load(){setLoading(true);setError("");try{setItems(await productsService.list())}catch(err){setError(err instanceof Error?err.message:"Unable to load listings.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 const visible=useMemo(()=>items.filter(p=>(category==="All"||p.category===category)&&[p.name,p.fitment,p.seller].join(" ").toLowerCase().includes(query.trim().toLowerCase())),[items,category,query]);
 return <MainLayout><section className="catalog-route"><Badge>PARTS HUB CATALOG</Badge><h1>Find your next part.</h1><p>Explore current listings from approved Parts Hub sellers.</p><ProductFilters query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory}/><div className="results-line"><span>{loading?"Loading listings…":`${visible.length} listings`}</span><span>Live marketplace catalog</span></div>{loading?<div className="catalog-state">Loading products…</div>:error?<div className="catalog-state catalog-error" role="alert"><p>{error}</p><button onClick={()=>void load()}>Try again</button></div>:<ProductGrid products={visible}/>}</section></MainLayout>;
}
