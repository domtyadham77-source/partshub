import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe,expect,it } from "vitest";
import ProductGrid from "./ProductGrid";
import { CartProvider } from "../../contexts/CartContext";
import { FavoritesProvider } from "../../contexts/FavoritesContext";
const product={id:"p1",name:"Brake pads",category:"Car parts" as const,fitment:"Corolla",price:1000,seller:"Parts Store",rating:0,description:"",stockStatus:"in-stock" as const};
describe("ProductGrid",()=>{it("renders an empty state",()=>{render(<ProductGrid products={[]}/>);expect(screen.getByText("No matching parts found")).toBeTruthy()});it("renders product cards",()=>{render(<MemoryRouter><CartProvider><FavoritesProvider><ProductGrid products={[product]}/></FavoritesProvider></CartProvider></MemoryRouter>);expect(screen.getByText("Brake pads")).toBeTruthy()});});
