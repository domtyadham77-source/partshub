import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe,expect,it,vi } from "vitest";
import RelatedProducts from "./RelatedProducts";
vi.mock("../../services/products",()=>({productsService:{list:async()=>[]}}));
const product={id:"p1",name:"Brake pads",category:"Car parts" as const,fitment:"Corolla",price:1200,seller:"Seller",rating:0,description:"",stockStatus:"in-stock" as const};
describe("RelatedProducts",()=>{it("does not render an empty related section",async()=>{render(<MemoryRouter><RelatedProducts product={product}/></MemoryRouter>);expect(screen.queryByText("Related listings")).toBeNull()});});
