import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe,expect,it } from "vitest";
import CartSummary from "./CartSummary";
describe("CartSummary",()=>{it("shows subtotal and checkout navigation",()=>{render(<MemoryRouter><CartSummary subtotal={2500}/></MemoryRouter>);expect(screen.getByText("Order summary")).toBeTruthy();expect(screen.getByText(/2,500/)).toBeTruthy();expect(screen.getByRole("link",{name:/continue to checkout/i})).toHaveAttribute("href","/checkout");});});
