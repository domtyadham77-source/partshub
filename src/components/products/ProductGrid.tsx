import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
export default function ProductGrid({ products, onAdd }: { products: Product[]; onAdd?: (product: Product) => void }) {
  if (!products.length) return <div className="empty-results"><h3>No matching parts found</h3><p>Try another search or clear your filters.</p></div>;
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div>;
}
