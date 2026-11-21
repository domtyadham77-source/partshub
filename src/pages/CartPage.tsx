import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import CartEmptyState from "../components/cart/CartEmptyState";
import MainLayout from "../components/layout/MainLayout";
import { useCart } from "../contexts/CartContext";

export default function CartPage(){
 const {items,subtotal,removeItem,setQuantity,clear}=useCart();
 return <MainLayout><section className="cart-page"><span className="eyebrow">YOUR SELECTION</span><h1>Shopping cart</h1>
 {items.length===0?<CartEmptyState/>:
 <div className="cart-layout"><div className="cart-lines">{items.map(({product,quantity})=><CartItem key={product.id} product={product} quantity={quantity} onQuantityChange={next=>setQuantity(product.id,next)} onRemove={()=>removeItem(product.id)}/>)}</div>
 <div><CartSummary subtotal={subtotal}/><button className="clear-cart" onClick={clear}>Clear cart</button></div></div>}
 </section></MainLayout>;
}
