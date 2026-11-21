import { Link } from "react-router-dom";
import { Bike, CarFront, Wrench, Star, Plus } from "lucide-react";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import Badge from "../ui/Badge";

export default function ProductCard({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) {
  const Icon = product.category === "Motorcycle parts" ? Bike : product.category === "Workshop" ? Wrench : CarFront;
  return <article className="product-card">
    <Link to={`/products/${product.id}`} className="catalog-card-link" aria-label={`View ${product.name}`}>
      <div className="product-visual"><Icon size={62} strokeWidth={1}/>{product.tag && <span className="product-tag">{product.tag}</span>}<span className="visual-code">{product.id.toUpperCase()}</span></div>
      <div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.fitment}</p></div>
    </Link>
    <div className="product-info product-card-bottom"><div className="seller-line"><span>{product.seller}</span><span><Star size={12} fill="currentColor"/> {product.rating.toFixed(1)}</span></div><div className="product-bottom"><b>{formatCurrency(product.price)}</b><button onClick={() => onAdd?.(product)} aria-label={`Add ${product.name} to cart`} disabled={product.stockStatus === "out-of-stock"}><Plus size={19}/></button></div>{product.stockStatus === "out-of-stock" && <Badge tone="neutral">Out of stock</Badge>}</div>
  </article>;
}
