import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Header/><main className="route-content">{children}</main><Footer/></div>;
}
