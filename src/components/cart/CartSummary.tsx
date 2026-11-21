import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import "./CartSummary.css";
export default function CartSummary({subtotal}:{subtotal:number}){
 return <aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{formatCurrency(subtotal)}</b></div><div><span>Delivery</span><span>Confirmed by seller</span></div><div className="cart-total"><span>Estimated total</span><b>{formatCurrency(subtotal)}</b></div><Link className="ph-button ph-button-primary checkout-link" to="/checkout">Continue to checkout</Link><p>Orders are split by seller. Cash on delivery is currently enabled; sellers confirm stock before fulfillment.</p></aside>;
}
