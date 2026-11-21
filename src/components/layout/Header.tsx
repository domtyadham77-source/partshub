import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Wrench, Heart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { count } = useCart();
  return <header className="shared-header">
    <Link className="brand" to="/" aria-label="Parts Hub home"><span className="brand-mark"><Wrench size={20}/></span><span>PARTS<span className="brand-accent">HUB</span></span></Link>
    <nav aria-label="Main navigation">
      <NavLink to="/cars">Car parts</NavLink><NavLink to="/motorcycles">Motorcycles</NavLink><NavLink to="/workshops">Workshops</NavLink><NavLink to="/sell">Sell with us</NavLink>
    </nav>
    <Link className="cart-button" to="/favorites" aria-label="Saved parts"><Heart size={17}/></Link>
    <Link className="cart-button" to="/cart"><ShoppingCart size={18}/><span>Cart</span><b className="header-cart-count">{count}</b></Link>
  </header>;
}
