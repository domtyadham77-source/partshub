import { Route, Routes } from "react-router-dom";
import App from "../App";
import CatalogPage from "../pages/CatalogPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import MainLayout from "../components/layout/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import Badge from "../components/ui/Badge";

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
  <Route path="/login" element={<InfoPage title="Welcome back" description="Secure sign-in is part of the account implementation stage."/>}/>
  <Route path="/register" element={<InfoPage title="Create your account" description="Customer and merchant registration will be implemented with verified server-side validation."/>}/>
  <Route path="/forgot-password" element={<InfoPage title="Recover your account" description="Account recovery will use a short-lived, one-time verification code with rate limits and secure storage."/>}/>
  <Route path="/account" element={<InfoPage title="My account" description="Your profile, addresses, and account preferences will appear here after sign-in is connected."/>}/>
  <Route path="/favorites" element={<InfoPage title="Saved parts" description="Favorites will sync to your account when authentication is connected."/>}/>
  <Route path="/cart" element={<InfoPage title="Your cart" description="The cart and stock validation flow is being implemented. Checkout will remain disabled until inventory and delivery rules are verified."/>}/>
  <Route path="/checkout" element={<InfoPage title="Checkout" description="Checkout will be enabled only after order validation, delivery options, and payment handling are implemented."/>}/>
  <Route path="/orders" element={<InfoPage title="My orders" description="Order history and tracking will be available after the order API is connected."/>}/>
  <Route path="/support" element={<InfoPage title="How can we help?" description="Support resources and request handling are planned for the next marketplace stage."/>}/>
  <Route path="*" element={<MainLayout><NotFoundPage/></MainLayout>}/>
 </Routes>;
}
