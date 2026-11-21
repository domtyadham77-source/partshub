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
import MerchantProductsPage from "../pages/MerchantProductsPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminMerchantsPage from "../pages/AdminMerchantsPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import MerchantOrdersPage from "../pages/MerchantOrdersPage";

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
  <Route path="/merchant" element={<RequireAuth roles={["merchant"]}><MerchantDashboardPage/></RequireAuth>}/>
  <Route path="/admin" element={<RequireAuth roles={["admin"]}><AdminDashboardPage/></RequireAuth>}/>
  <Route path="/admin/merchants" element={<RequireAuth roles={["admin"]}><AdminMerchantsPage/></RequireAuth>}/>
  <Route path="/admin/products" element={<RequireAuth roles={["admin"]}><AdminProductsPage/></RequireAuth>}/>
  <Route path="/admin/users" element={<RequireAuth roles={["admin"]}><AdminUsersPage/></RequireAuth>}/>
  <Route path="/admin/orders" element={<RequireAuth roles={["admin"]}><AdminOrdersPage/></RequireAuth>}/>
  <Route path="/merchant/products" element={<RequireAuth roles={["merchant"]}><MerchantProductsPage/></RequireAuth>}/>
  <Route path="/merchant/orders" element={<RequireAuth roles={["merchant"]}><MerchantOrdersPage/></RequireAuth>}/>
  <Route path="/favorites" element={<FavoritesPage/>}/>
  <Route path="/cart" element={<CartPage/>}/>
  <Route path="/checkout" element={<RequireAuth><CheckoutPage/></RequireAuth>}/>
  <Route path="/orders" element={<RequireAuth><OrdersPage/></RequireAuth>}/>
  <Route path="/orders/:id" element={<RequireAuth><OrderDetailsPage/></RequireAuth>}/>
  <Route path="/support" element={<InfoPage title="How can we help?" description="Support resources and request handling are planned for the next marketplace stage."/>}/>
  <Route path="*" element={<MainLayout><NotFoundPage/></MainLayout>}/>
 </Routes>;
}
