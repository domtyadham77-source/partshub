import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe,expect,it } from "vitest";
import CartEmptyState from "./CartEmptyState";
describe("CartEmptyState",()=>{it("offers a route back to the marketplace",()=>{render(<MemoryRouter><CartEmptyState/></MemoryRouter>);expect(screen.getByText("Your cart is empty")).toBeTruthy();expect(screen.getByRole("link",{name:/explore marketplace/i})).toHaveAttribute("href","/");});});
