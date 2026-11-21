import { Route, Routes } from "react-router-dom";
import App from "../App";
import CatalogPage from "../pages/CatalogPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import FavoritesPage from "../pages/FavoritesPage";
import MainLayout from "../components/layout/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import Badge from "../components/ui/Badge";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AccountPage from "../pages/AccountPage";
import RequireAuth from "../components/auth/RequireAuth";
import MerchantDashboardPage from "../pages/MerchantDashboardPage";

function InfoPage({ title, description, links = [] }: { title: string; description: string; links?: { label: string; to: string }[] }) {
  return <MainLayout><section className="route-panel"><Badge>PARTS HUB PREVIEW</Badge><h1>{title}</h1><p>{description}</p><div className="route-links">{links.map(link => <a key={link.to} href={link.to}>{link.label} <span>↗</span></a>)}</div><p className="route-note">This section is being built. No orders, payments, or account changes are processed here yet.</p></section></MainLayout>;
}
export default function AppRouter() {
 return <Routes>
  <Route path="/" element={<App/>}/>
  <Route path="/cars" element={<CatalogPage initialCategory="Car parts"/>}/>
  <Route path="/motorcycles" element={<CatalogPage initialCategory="Motorcycle parts"/>}/>
  <Route path="/products/:id" element={<ProductDetailsPage/>}/>
  <Route path="/workshops" element={<InfoPage title="Garages & workshops" description="Find maintenance centers and workshops. Provider profiles, services, and booking will be added after the marketplace foundation."/>}/>
  <Route path="/sell" element={<InfoPage title="Sell with Parts Hub" description="A dedicated seller workspace is planned for merchant onboarding, inventory, pricing, and order management."/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
  <Route path="/account" element={<AccountPage/>}/>
  <Route path="/merchant/*" element={<RequireAuth roles={["merchant"]}><MerchantDashboardPage/></RequireAuth>}/>
  <Route path="/favorites" element={<FavoritesPage/>}/>
  <Route path="/cart" element={<CartPage/>}/>
  <Route path="/checkout" element={<InfoPage title="Checkout" description="Checkout will be enabled only after order validation, delivery options, and payment handling are implemented."/>}/>
  <Route path="/orders" element={<InfoPage title="My orders" description="Order history and tracking will be available after the order API is connected."/>}/>
  <Route path="/support" element={<InfoPage title="How can we help?" description="Support resources and request handling are planned for the next marketplace stage."/>}/>
  <Route path="*" element={<MainLayout><NotFoundPage/></MainLayout>}/>
 </Routes>;
}
