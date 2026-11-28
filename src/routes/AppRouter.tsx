import { Route, Routes } from "react-router-dom";
import Footer from "../components/layout/Footer";
import MarketplaceInfoPage from "../pages/MarketplaceInfoPage";
import App from "../App";
import CatalogPage from "../pages/CatalogPage";
import CarsPage from "../pages/CarsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import FavoritesPage from "../pages/FavoritesPage";
import MainLayout from "../components/layout/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import Badge from "../components/ui/Badge";
import { useLanguage } from "../contexts/LanguageContext";
import AdminEntryPage from "../pages/AdminEntryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AccountPage from "../pages/AccountPage";
import SettingsPage from "../pages/SettingsPage";
import RequireAuth from "../components/auth/RequireAuth";
import MerchantDashboardPage from "../pages/MerchantDashboardPage";
import MerchantProductsPage from "../pages/MerchantProductsPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminMerchantsPage from "../pages/AdminMerchantsPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminSupportPage from "../pages/AdminSupportPage";
import SupportPage from "../pages/SupportPage";
import NotificationsPage from "../pages/NotificationsPage";
import AdminNotificationsPage from "../pages/AdminNotificationsPage";
import AdminReportsPage from "../pages/AdminReportsPage";
import AdminCategoriesPage from "../pages/AdminCategoriesPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";
import WorkshopsPage from "../pages/WorkshopsPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import MerchantOrdersPage from "../pages/MerchantOrdersPage";
import MerchantProfilePage from "../pages/MerchantProfilePage";

function InfoPage({ title, description, links = [] }: { title: string; description: string; links?: { label: string; to: string }[] }) {
  const { t } = useLanguage();
  return <MainLayout><section className="route-panel"><Badge>{t("PARTS HUB PREVIEW")}</Badge><h1>{t(title)}</h1><p>{t(description)}</p><div className="route-links">{links.map(link => <a key={link.to} href={link.to}>{t(link.label)} <span>↗</span></a>)}</div><p className="route-note">{t("This section is being built. No orders, payments, or account changes are processed here yet.")}</p></section></MainLayout>;
}
export default function AppRouter() {
 return <div className="route-app-root"><Routes>
  <Route path="/" element={<App/>}/>
  <Route path="/cars" element={<CarsPage/>}/>
  <Route path="/motorcycles" element={<CatalogPage initialCategory="Motorcycle parts"/>}/>
  <Route path="/products/:id" element={<ProductDetailsPage/>}/>
  <Route path="/workshops" element={<WorkshopsPage/>}/>
  <Route path="/sell" element={<InfoPage title="Sell with Parts Hub" description="A dedicated seller workspace is planned for merchant onboarding, inventory, pricing, and order management."/>}/>
  <Route path="/about" element={<MarketplaceInfoPage kind="about"/>}/>
  <Route path="/shipping-policy" element={<MarketplaceInfoPage kind="shipping"/>}/>
  <Route path="/return-cancellation-policy" element={<MarketplaceInfoPage kind="returns"/>}/>
  <Route path="/contact" element={<MarketplaceInfoPage kind="contact"/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
  <Route path="/account" element={<AccountPage/>}/>
  <Route path="/settings" element={<RequireAuth><SettingsPage/></RequireAuth>}/>
  <Route path="/merchant" element={<RequireAuth roles={["merchant"]}><MerchantDashboardPage/></RequireAuth>}/>
  <Route path="/admin" element={<AdminEntryPage/>}/>
  <Route path="/admin/dashboard" element={<RequireAuth roles={["admin"]}><AdminDashboardPage/></RequireAuth>}/>
  <Route path="/admin/merchants" element={<RequireAuth roles={["admin"]}><AdminMerchantsPage/></RequireAuth>}/>
  <Route path="/admin/products" element={<RequireAuth roles={["admin"]}><AdminProductsPage/></RequireAuth>}/>
  <Route path="/admin/users" element={<RequireAuth roles={["admin"]}><AdminUsersPage/></RequireAuth>}/>
  <Route path="/admin/orders" element={<RequireAuth roles={["admin"]}><AdminOrdersPage/></RequireAuth>}/>
  <Route path="/admin/support" element={<RequireAuth roles={["admin"]}><AdminSupportPage/></RequireAuth>}/>
  <Route path="/admin/notifications" element={<RequireAuth roles={["admin"]}><AdminNotificationsPage/></RequireAuth>}/>
  <Route path="/admin/reports" element={<RequireAuth roles={["admin"]}><AdminReportsPage/></RequireAuth>}/>
  <Route path="/admin/categories" element={<RequireAuth roles={["admin"]}><AdminCategoriesPage/></RequireAuth>}/>
  <Route path="/admin/settings" element={<RequireAuth roles={["admin"]}><AdminSettingsPage/></RequireAuth>}/>
  <Route path="/merchant/products" element={<RequireAuth roles={["merchant"]}><MerchantProductsPage/></RequireAuth>}/>
  <Route path="/merchant/orders" element={<RequireAuth roles={["merchant"]}><MerchantOrdersPage/></RequireAuth>}/>
  <Route path="/merchant/profile" element={<RequireAuth roles={["merchant"]}><MerchantProfilePage/></RequireAuth>}/>
  <Route path="/notifications" element={<RequireAuth><NotificationsPage/></RequireAuth>}/>
  <Route path="/favorites" element={<FavoritesPage/>}/>
  <Route path="/cart" element={<RequireAuth><CartPage/></RequireAuth>}/>
  <Route path="/checkout" element={<RequireAuth><CheckoutPage/></RequireAuth>}/>
  <Route path="/orders" element={<RequireAuth><OrdersPage/></RequireAuth>}/>
  <Route path="/orders/:id" element={<RequireAuth><OrderDetailsPage/></RequireAuth>}/>
  <Route path="/support" element={<RequireAuth><SupportPage/></RequireAuth>}/>
  <Route path="*" element={<MainLayout><NotFoundPage/></MainLayout>}/>
 </Routes><Footer/></div>;
}
