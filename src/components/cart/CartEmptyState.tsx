import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import "./CartEmptyState.css";
export default function CartEmptyState(){return <div className="cart-empty"><ShoppingBag size={42}/><h2>Your cart is empty</h2><p>Find the parts you need and add them here.</p><Link className="ph-link-button" to="/">Explore marketplace</Link></div>;}
