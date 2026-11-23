/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastProvider } from "./contexts/ToastContext";
import {LanguageProvider} from "./contexts/LanguageContext";
import GlobalMotion from "./components/layout/GlobalMotion";
import { PWA_SERVICE_WORKER_URL, shouldRegisterServiceWorker } from "./utils/pwa";
import "./styles/variables.css";import "./styles/animations.css";import "./styles/global.css";import "./styles/components.css";import "./styles/catalog.css";import "./styles/cart.css";import "./styles/favorites.css";import "./styles/merchant.css";import "./styles/orders.css";import "./styles/support.css";import "./styles/notifications.css";import "./styles/workshops.css";
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><BrowserRouter><LanguageProvider><GlobalMotion><ToastProvider><AuthProvider><NotificationProvider><CartProvider><FavoritesProvider><AppRouter/></FavoritesProvider></CartProvider></NotificationProvider></AuthProvider></ToastProvider></GlobalMotion></LanguageProvider></BrowserRouter></React.StrictMode>);
if (shouldRegisterServiceWorker(import.meta.env.PROD, "serviceWorker" in navigator)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(PWA_SERVICE_WORKER_URL).catch(error => console.error("Service worker registration failed:", error));
  });
}
