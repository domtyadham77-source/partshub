import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import ProductGallery from "./ProductGallery";
const product={id:"p1",name:"Brake pads",category:"Car parts" as const,fitment:"Corolla",price:1200,seller:"Seller",rating:0,description:"",stockStatus:"in-stock" as const};
describe("ProductGallery",()=>{it("shows a placeholder when no image exists",()=>{render(<ProductGallery product={product}/>);expect(screen.getByText("PRODUCT IMAGE")).toBeTruthy()});it("renders the uploaded image",()=>{render(<ProductGallery product={{...product,imageUrl:"/api/images/1"}}/>);expect(screen.getByAltText("Brake pads")).toHaveAttribute("src","/api/images/1")});});
