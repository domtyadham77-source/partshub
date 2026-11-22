import {useState} from "react";
import {Link,NavLink,useNavigate} from "react-router-dom";
import {Menu,X,Heart,Bell,UserRound,ShoppingCart,Settings,LogIn,UserPlus,Package,Store,Wrench} from "lucide-react";
import {useNotifications} from "../../contexts/NotificationContext";
import {useAuth} from "../../contexts/AuthContext";
import {useCart} from "../../contexts/CartContext";
import {useLanguage} from "../../contexts/LanguageContext";

export default function Header(){
 const [menuOpen,setMenuOpen]=useState(false);
 const {user,loading}=useAuth();
 const {unreadCount}=useNotifications();
 const {language,setLanguage,t}=useLanguage();
 const {count}=useCart();
 const navigate=useNavigate();
 const close=()=>setMenuOpen(false);
 const languageLabel=language==="en"?"AR":"EN";
 return <header className="shared-header">
  <Link className="brand" to="/" aria-label="Parts Hub home" onClick={close}><span className="brand-mark"><Wrench size={20}/></span><span>PARTS<span className="brand-accent">HUB</span></span></Link>
  <nav className="shared-desktop-nav" aria-label="Main navigation"><NavLink to="/cars">{t("Car parts")}</NavLink><NavLink to="/motorcycles">{t("Motorcycles")}</NavLink><NavLink to="/workshops">{t("Workshops")}</NavLink><NavLink to="/sell">{t("Sell with us")}</NavLink></nav>
  <div className="shared-header-actions">
   <button type="button" className="language-toggle language-toggle-compact" onClick={()=>setLanguage(language==="en"?"ar":"en")} aria-label={language==="en"?"Switch to Arabic":"Switch to English"}>{languageLabel}</button>
   {!loading&&user&&<><Link className="header-icon-button" to="/favorites" aria-label="Saved parts"><Heart size={18}/></Link><Link className="header-icon-button" to="/cart" aria-label={`Shopping cart, ${count} items`}><ShoppingCart size={18}/>{count>0&&<b>{count}</b>}</Link><Link className="header-icon-button" to="/notifications" aria-label={`${unreadCount} unread notifications`}><Bell size={18}/>{unreadCount>0&&<b>{unreadCount}</b>}</Link></>}
   <button type="button" className="hamburger-button" aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={21}/>:<Menu size={21}/>}</button>
  </div>
  {menuOpen&&<><button className="menu-backdrop" aria-label="Close menu" onClick={close}/><aside className="hamburger-panel" aria-label="Site menu">
   <div className="hamburger-panel-heading"><strong>{t("Menu")}</strong><button type="button" className="menu-close" onClick={close} aria-label="Close menu"><X size={19}/></button></div>
   <div className="hamburger-links">
    <Link to="/cars" onClick={close}><Package size={17}/>{t("Car parts")}</Link>
    <Link to="/motorcycles" onClick={close}><Package size={17}/>{t("Motorcycles")}</Link>
    <Link to="/workshops" onClick={close}><Wrench size={17}/>{t("Workshops")}</Link>
    <Link to="/sell" onClick={close}><Store size={17}/>{t("Sell with us")}</Link>
    {user&&<><Link to="/account" onClick={close}><UserRound size={17}/>{t("Account")}</Link><Link to="/orders" onClick={close}><ShoppingCart size={17}/>{t("My orders")}</Link><Link to="/settings" onClick={close}><Settings size={17}/>{t("Settings")}</Link></>}
   </div>
   <div className="hamburger-account">
    {!loading&&!user&&<><p>{t("Sign in to add items to your cart and place an order.")}</p><button className="menu-primary-action" onClick={()=>{close();navigate("/login")}}><LogIn size={16}/>{t("Sign in")}</button><button className="menu-secondary-action" onClick={()=>{close();navigate("/register")}}><UserPlus size={16}/>{t("Create account")}</button></>}
    {!loading&&user&&<><Link to="/account" onClick={close}><UserRound size={16}/>{user.fullName}</Link><button className="menu-secondary-action" onClick={()=>{close();navigate("/settings")}}><Settings size={16}/>{t("Settings")}</button></>}
   </div>
  </aside></>}
 </header>;
}
