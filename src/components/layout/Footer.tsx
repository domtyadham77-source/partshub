import {Link} from "react-router-dom";
import {useLanguage} from "../../contexts/LanguageContext";

export default function Footer(){
 const {t}=useLanguage();
 return <footer className="shared-footer">
  <Link className="brand" to="/" aria-label="Parts Hub home">
   <img className="brand-logo" src="/brand/parts-hub-wordmark.png" alt="Parts Hub"/>
  </Link>
  <div><Link to="/support">{t("Help & support")}</Link><Link to="/sell">{t("Become a seller")}</Link><Link to="/account">{t("My account")}</Link></div>
  <small>© {new Date().getFullYear()} Parts Hub. {t("Parts for the road ahead.")}</small>
 </footer>;
}
