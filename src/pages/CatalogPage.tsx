import { useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import { products } from "../data/products";
import type { ProductCategory } from "../types/product";
import Badge from "../components/ui/Badge";

export default function CatalogPage({ initialCategory = "All" }: { initialCategory?: ProductCategory|"All" }) {
 const [query,setQuery]=useState(""); const [category,setCategory]=useState<ProductCategory|"All">(initialCategory);
 const visible=useMemo(()=>products.filter(p=>(category==="All"||p.category===category)&&[p.name,p.fitment,p.seller].join(" ").toLowerCase().includes(query.trim().toLowerCase())),[category,query]);
 return <MainLayout><section className="catalog-route"><Badge>PARTS HUB CATALOG</Badge><h1>Find your next part.</h1><p>Explore sample listings while the live seller inventory is being connected.</p><ProductFilters query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory}/><div className="results-line"><span>{visible.length} listings</span><span>Sample preview data</span></div><ProductGrid products={visible}/></section></MainLayout>;
}
