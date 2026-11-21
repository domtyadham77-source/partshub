import { describe, expect, it, beforeEach, afterEach } from "vitest";\nimport { cleanup } from "@testing-library/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import type { Product } from "../types/product";

const sample:Product={id:"test-1",name:"Test brake pad",category:"Car parts",fitment:"Test model",price:1000,seller:"Test seller",rating:4.8,description:"Test item",stockStatus:"in-stock"};
function Harness(){const cart=useCart();return <><span data-testid="count">{cart.count}</span><span data-testid="subtotal">{cart.subtotal}</span><button onClick={()=>cart.addItem(sample)}>add</button><button onClick={()=>cart.setQuantity(sample.id,3)}>set</button><button onClick={()=>cart.removeItem(sample.id)}>remove</button></>;}
describe("CartProvider",()=>{beforeEach(()=>localStorage.clear());afterEach(()=>cleanup());it("adds items and calculates totals",()=>{render(<CartProvider><Harness/></CartProvider>);fireEvent.click(screen.getByText("add"));expect(screen.getByTestId("count").textContent).toBe("1");expect(screen.getByTestId("subtotal").textContent).toBe("1000");});it("updates and removes quantities",()=>{render(<CartProvider><Harness/></CartProvider>);fireEvent.click(screen.getByText("add"));fireEvent.click(screen.getByText("set"));expect(screen.getByTestId("count").textContent).toBe("3");fireEvent.click(screen.getByText("remove"));expect(screen.getByTestId("count").textContent).toBe("0");});});
