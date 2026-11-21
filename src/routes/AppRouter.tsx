import { Route, Routes, Link } from "react-router-dom";
import App from "../App";
import MainLayout from "../components/layout/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import Badge from "../components/ui/Badge";

function InfoPage({ title, description, links = [] }: { title: string; description: string; links?: { label: string; to: string }[] }) {
  return <MainLayout><section className="route-panel"><Badge>PARTS HUB PREVIEW</Badge><h1>{title}</h1><p>{description}</p><div className="route-links">{links.map(link => <Link key={link.to} to={link.to}>{link.label} <span>↗</span></Link>)}</div><p className="route-note">This section is being built. No orders, payments, or account changes are processed here yet.</p></section></MainLayout>;
}

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="/cars" element={<InfoPage title="Car parts" description="Browse components and accessories for cars. Vehicle fitment and verified seller inventory will be connected in the next implementation stage." links={[{label:"Motorcycle parts",to:"/motorcycles"},{label:"Explore marketplace",to:"/"}]}/>}/>
    <Route path="/motorcycles" element={<InfoPage title="Motorcycle parts" description="Parts and accessories for daily riders, sport bikes, and off-road motorcycles." links={[{label:"Car parts",to:"/cars"},{label:"Explore marketplace",to:"/"}]}/>}/>
    <Route path="/workshops" element={<InfoPage title="Garages & workshops" description="Find maintenance centers and workshops. Provider profiles, services, and booking will be added after the marketplace foundation."/>}/>
    <Route path="/sell" element={<InfoPage title="Sell with Parts Hub" description="A dedicated seller workspace is planned for merchant onboarding, inventory, pricing, and order management." links={[{label:"Create account",to:"/register"},{label:"Seller information",to:"/support"}]}/>}/>
    <Route path="/login" element={<InfoPage title="Welcome back" description="Secure sign-in is part of the account implementation stage." links={[{label:"Create an account",to:"/register"},{label:"Forgot password",to:"/forgot-password"}]}/>}/>
    <Route path="/register" element={<InfoPage title="Create your account" description="Customer and merchant registration will be implemented with verified server-side validation." links={[{label:"Already registered? Sign in",to:"/login"}]}/>}/>
    <Route path="/forgot-password" element={<InfoPage title="Recover your account" description="Account recovery will use a short-lived, one-time verification code with rate limits and secure storage." links={[{label:"Back to sign in",to:"/login"}]}/>}/>
    <Route path="/account" element={<InfoPage title="My account" description="Your profile, addresses, and account preferences will appear here after sign-in is connected." links={[{label:"Sign in",to:"/login"},{label:"My orders",to:"/orders"}]}/>}/>
    <Route path="/favorites" element={<InfoPage title="Saved parts" description="Keep useful products in one place. Favorites will sync to your account when authentication is connected." links={[{label:"Explore parts",to:"/"}]}/>}/>
    <Route path="/cart" element={<InfoPage title="Your cart" description="The cart and stock validation flow is being implemented. Checkout will remain disabled until prices, inventory, and delivery rules are verified." links={[{label:"Continue shopping",to:"/"}]}/>}/>
    <Route path="/checkout" element={<InfoPage title="Checkout" description="Checkout will be enabled only after order validation, delivery options, and payment handling are implemented." links={[{label:"Return to cart",to:"/cart"}]}/>}/>
    <Route path="/orders" element={<InfoPage title="My orders" description="Order history and tracking will be available after the order API is connected." links={[{label:"My account",to:"/account"}]}/>}/>
    <Route path="/support" element={<InfoPage title="How can we help?" description="Support resources and request handling are planned for the next marketplace stage." links={[{label:"Explore marketplace",to:"/"}]}/>}/>
    <Route path="*" element={<MainLayout><NotFoundPage/></MainLayout>}/>
  </Routes>;
}
