import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";import {useLanguage} from "../../contexts/LanguageContext";
export default function ProductGrid({ products }: { products: Product[] }) {
  const {t}=useLanguage();if (!products.length) return <div className="empty-results"><h3>{t("No matching parts found")}</h3><p>{t("Try another search or clear your filters.")}</p></div>;
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div>;
}
