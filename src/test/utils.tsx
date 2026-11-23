import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { CartProvider } from "../contexts/CartContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

type Options = Omit<RenderOptions, "wrapper"> & { initialEntries?: string[] };

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { initialEntries = ["/"], ...renderOptions } = options;
  function Wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider><ToastProvider><AuthProvider><NotificationProvider><CartProvider><FavoritesProvider>
        {children}
      </FavoritesProvider></CartProvider></NotificationProvider></AuthProvider></ToastProvider></LanguageProvider>
    </MemoryRouter>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
