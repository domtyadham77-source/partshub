import { Search } from "lucide-react";
import type { ProductCategory } from "../../types/product";import {useLanguage} from "../../contexts/LanguageContext";
type Props = { query:string; onQueryChange:(value:string)=>void; category:ProductCategory|"All"; onCategoryChange:(value:ProductCategory|"All")=>void };
const categories: (ProductCategory|"All")[] = ["All","Car parts","Motorcycle parts","Workshop"];
export default function ProductFilters({query,onQueryChange,category,onCategoryChange}:Props) {
 const {t}=useLanguage();return <div className="catalog-controls"><label className="catalog-search"><Search size={17}/><input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={t("Search name, vehicle or seller")} aria-label="Search products"/></label><div className="category-tabs">{categories.map(item=><button key={item} className={category===item?"selected":""} onClick={()=>onCategoryChange(item)}>{t(item)}</button>)}</div></div>;
}
