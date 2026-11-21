import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Wrench, Heart, UserRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { count } = useCart();
  const { user, loading } = useAuth();
  return <header className="shared-header">
    <Link className="brand" to="/" aria-label="Parts Hub home"><span className="brand-mark"><Wrench size={20}/></span><span>PARTS<span className="brand-accent">HUB</span></span></Link>
    <nav aria-label="Main navigation">
      <NavLink to="/cars">Car parts</NavLink><NavLink to="/motorcycles">Motorcycles</NavLink><NavLink to="/workshops">Workshops</NavLink><NavLink to="/sell">Sell with us</NavLink>
    </nav>
    <Link className="cart-button" to="/favorites" aria-label="Saved parts"><Heart size={17}/></Link>
    {!loading && <Link className="account-button" to={user?"/account":"/login"}><UserRound size={16}/><span>{user?"Account":"Sign in"}</span></Link>}
    <Link className="cart-button" to="/cart"><ShoppingCart size={18}/><span>Cart</span><b className="header-cart-count">{count}</b></Link>
  </header>;
}
