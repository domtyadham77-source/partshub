import { Search } from "lucide-react";
import type { ProductCategory } from "../../types/product";
type Props = { query:string; onQueryChange:(value:string)=>void; category:ProductCategory|"All"; onCategoryChange:(value:ProductCategory|"All")=>void };
const categories: (ProductCategory|"All")[] = ["All","Car parts","Motorcycle parts","Workshop"];
export default function ProductFilters({query,onQueryChange,category,onCategoryChange}:Props) {
 return <div className="catalog-controls"><label className="catalog-search"><Search size={17}/><input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder="Search name, vehicle or seller" aria-label="Search products"/></label><div className="category-tabs">{categories.map(item=><button key={item} className={category===item?"selected":""} onClick={()=>onCategoryChange(item)}>{item}</button>)}</div></div>;
}
