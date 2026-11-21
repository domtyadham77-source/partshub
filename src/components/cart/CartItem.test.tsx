import { fireEvent,render,screen } from "@testing-library/react";
import { describe,expect,it,vi } from "vitest";
import CartItem from "./CartItem";
const product={id:"p1",name:"Brake pads",category:"Car parts" as const,fitment:"Corolla",price:1000,seller:"Seller",rating:0,description:"",stockStatus:"in-stock" as const};
describe("CartItem",()=>{it("shows product details and quantity controls",()=>{const change=vi.fn(),remove=vi.fn();render(<CartItem product={product} quantity={2} onQuantityChange={change} onRemove={remove}/>);expect(screen.getByText("Brake pads")).toBeTruthy();fireEvent.click(screen.getByLabelText("Increase quantity"));expect(change).toHaveBeenCalledWith(3);fireEvent.click(screen.getByLabelText("Remove Brake pads"));expect(remove).toHaveBeenCalled();});});
