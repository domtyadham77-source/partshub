import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Footer() {
  return <footer className="shared-footer">
    <Link className="brand" to="/"><span className="brand-mark"><Wrench size={17}/></span><span>PARTS<span className="brand-accent">HUB</span></span></Link>
    <div><Link to="/support">Help & support</Link><Link to="/sell">Become a seller</Link><Link to="/account">My account</Link></div>
    <small>© {new Date().getFullYear()} Parts Hub. Built for the road ahead.</small>
  </footer>;
}
