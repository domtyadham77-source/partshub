import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function CartPage(){
 const {items,subtotal,removeItem,setQuantity,clear}=useCart();
 return <MainLayout><section className="cart-page"><span className="eyebrow">YOUR SELECTION</span><h1>Shopping cart</h1>
 {items.length===0?<div className="cart-empty"><ShoppingBag size={42}/><h2>Your cart is empty</h2><p>Find the parts you need and add them here.</p><Link className="ph-link-button" to="/">Explore marketplace</Link></div>:
 <div className="cart-layout"><div className="cart-lines">{items.map(({product,quantity})=><article className="cart-line" key={product.id}><div className="cart-line-art">PH</div><div className="cart-line-info"><b>{product.name}</b><small>{product.fitment}</small><span>{formatCurrency(product.price)}</span></div><div className="quantity-control"><button aria-label="Decrease quantity" onClick={()=>setQuantity(product.id,quantity-1)}><Minus size={14}/></button><b>{quantity}</b><button aria-label="Increase quantity" onClick={()=>setQuantity(product.id,quantity+1)}><Plus size={14}/></button></div><button className="remove-line" aria-label={`Remove ${product.name}`} onClick={()=>removeItem(product.id)}><Trash2 size={17}/></button></article>)}</div>
 <aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{formatCurrency(subtotal)}</b></div><div><span>Delivery</span><span>Calculated later</span></div><div className="cart-total"><span>Estimated total</span><b>{formatCurrency(subtotal)}</b></div><Link className="ph-button ph-button-primary checkout-link" to="/checkout">Continue to checkout</Link><p>Orders are split by seller. Cash on delivery is currently enabled; sellers confirm stock before fulfillment.</p><button className="clear-cart" onClick={clear}>Clear cart</button></aside></div>}
 </section></MainLayout>;
}
