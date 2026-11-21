import { fireEvent,render,screen } from "@testing-library/react";
import { describe,expect,it,vi } from "vitest";
import ProductImageEditor from "./ProductImageEditor";
vi.mock("react-easy-crop",()=>({default:()=> <div data-testid="cropper"/>}));
describe("ProductImageEditor",()=>{it("supports rotate and reset controls",()=>{render(<ProductImageEditor imageSrc="image-data" onSave={vi.fn()}/>);fireEvent.click(screen.getByLabelText("Rotate right"));expect(screen.getByText("90°")).toBeTruthy();fireEvent.click(screen.getByText("Reset"));expect(screen.getByText("0°")).toBeTruthy();});});
