import { useEffect,useMemo,useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import type { Product,ProductCategory } from "../types/product";
import { productsService } from "../services/products";
import Badge from "../components/ui/Badge";import {useLanguage} from "../contexts/LanguageContext";

export default function CatalogPage({ initialCategory = "All" }: { initialCategory?: ProductCategory|"All" }) {
 const {t}=useLanguage();const [query,setQuery]=useState("");const [category,setCategory]=useState<ProductCategory|"All">(initialCategory);const [items,setItems]=useState<Product[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 async function load(){setLoading(true);setError("");try{setItems(await productsService.list())}catch(err){setError(err instanceof Error?err.message:"Unable to load listings.")}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 const visible=useMemo(()=>{const filtered=items.filter(p=>(category==="All"||p.category===category)&&[p.name,p.fitment].join(" ").toLowerCase().includes(query.trim().toLowerCase()));const groups=new Map<string,Product>();for(const p of filtered){const key=(p.name+"|"+p.fitment).toLowerCase();const old=groups.get(key);if(!old||p.price<old.price)groups.set(key,p);}return [...groups.values()].sort((a,b)=>a.price-b.price);},[items,category,query]);
 return <MainLayout><section className="catalog-route"><Badge>{t("PARTS HUB CATALOG")}</Badge><h1>{t("Find your next part.")}</h1><p>{t("Explore current listings from approved Parts Hub sellers.")}</p><ProductFilters query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory}/><div className="results-line"><span>{loading?t("Loading listings…"):`${visible.length} ${t("listings")}`}</span><span>{t("Live marketplace catalog")}</span></div>{loading?<div className="catalog-state">{t("Loading products…")}</div>:error?<div className="catalog-state catalog-error" role="alert"><p>{error}</p><button onClick={()=>void load()}>{t("Try again")}</button></div>:<ProductGrid products={visible}/>}</section></MainLayout>;
}
