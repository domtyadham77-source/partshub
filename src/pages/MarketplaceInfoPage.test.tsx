import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import MarketplaceInfoPage from "./MarketplaceInfoPage";

vi.mock("../components/layout/MainLayout", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));

describe("Marketplace information pages", () => {
 it("explains the marketplace intermediary model", () => {
  render(<MemoryRouter><LanguageProvider><MarketplaceInfoPage kind="about"/></LanguageProvider></MemoryRouter>);
  expect(screen.getByRole("heading", { name: /parts hub/i })).toBeInTheDocument();
  expect(screen.getByText(/marketplace and intermediary/i)).toBeInTheDocument();
 });
 it("summarizes statutory return rights", () => {
  render(<MemoryRouter><LanguageProvider><MarketplaceInfoPage kind="returns"/></LanguageProvider></MemoryRouter>);
  expect(screen.getByText(/14-day right/i)).toBeInTheDocument();
  expect(screen.getByText(/Article 21/i)).toBeInTheDocument();
  expect(screen.getByText(/30 days/i)).toBeInTheDocument();
 });
});
