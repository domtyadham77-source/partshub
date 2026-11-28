import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Footer() {
 const { t } = useLanguage();
 return <footer className="shared-footer">
  <Link className="brand" to="/" aria-label="Parts Hub home"><span className="brand-mark"><Wrench size={17}/></span><span>PARTS<span className="brand-accent">HUB</span></span></Link>
  <nav className="footer-policy-links" aria-label={t("Information and policies")}>
   <Link to="/about">{t("About us")}</Link>
   <Link to="/shipping-policy">{t("Shipping")}</Link>
   <Link to="/return-cancellation-policy">{t("Returns & cancellations")}</Link>
   <Link to="/contact">{t("Contact")}</Link>
  </nav>
  <div className="footer-account-links"><Link to="/support">{t("Help & support")}</Link><Link to="/sell">{t("Become a seller")}</Link><Link to="/account">{t("My account")}</Link></div>
  <small>© {new Date().getFullYear()} Parts Hub. {t("Parts for the road ahead.")}</small>
  <small className="developer-credit">Developed by Adham</small>
 </footer>;
}
