import { fireEvent,render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "./ProductCard";
import { CartProvider,useCart } from "../../contexts/CartContext";
import { FavoritesProvider } from "../../contexts/FavoritesContext";
vi.mock("../../contexts/AuthContext",()=>({useAuth:()=>({user:{id:"u1"},loading:false})}));
const product={id:"p1",name:"Brake pads",category:"Car parts" as const,fitment:"Corolla",price:1000,seller:"Parts Store",rating:0,description:"",stockStatus:"in-stock" as const};
function Wrapper(){const cart=useCart();return <><ProductCard product={product}/><span data-testid="count">{cart.count}</span></>}
describe("ProductCard",()=>{it("adds a product to cart and supports favorites",()=>{render(<MemoryRouter><CartProvider><FavoritesProvider><Wrapper/></FavoritesProvider></CartProvider></MemoryRouter>);fireEvent.click(screen.getByLabelText("Add Brake pads to cart"));expect(screen.getByTestId("count").textContent).toBe("1");fireEvent.click(screen.getByLabelText("Add to favorites"));expect(screen.getByLabelText("Remove from favorites")).toBeTruthy();});});
