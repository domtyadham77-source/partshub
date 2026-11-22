import { Minus,Plus,Trash2 } from "lucide-react";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import "./CartItem.css";
export default function CartItem({product,quantity,onQuantityChange,onRemove}:{product:Product;quantity:number;onQuantityChange:(quantity:number)=>void;onRemove:()=>void}){
 return <article className="cart-line"><div className="cart-line-art">{product.imageUrl?<img src={product.imageUrl} alt=""/>:"PH"}</div><div className="cart-line-info"><b>{product.name}</b><small>{product.fitment}</small><span>{formatCurrency(product.price)}</span></div><div className="quantity-control"><button aria-label="Decrease quantity" onClick={()=>onQuantityChange(quantity-1)}><Minus size={14}/></button><b>{quantity}</b><button aria-label="Increase quantity" onClick={()=>onQuantityChange(quantity+1)}><Plus size={14}/></button></div><button className="remove-line" aria-label={`Remove ${product.name}`} onClick={onRemove}><Trash2 size={17}/></button></article>;
}
