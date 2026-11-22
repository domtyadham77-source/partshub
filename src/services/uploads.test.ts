import {describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiUpload:vi.fn()}));
import {apiUpload} from "./api";
import {uploadsService} from "./uploads";
describe("uploadsService",()=>{it("uploads a product image as multipart form data",async()=>{vi.mocked(apiUpload).mockResolvedValue({imageUrl:"/images/p1"});const blob=new Blob(["image"],{type:"image/jpeg"});await expect(uploadsService.uploadProductImage("product/1",blob)).resolves.toEqual({imageUrl:"/images/p1"});expect(apiUpload).toHaveBeenCalledWith("/merchant/products/product%2F1/image",expect.any(FormData));const form=vi.mocked(apiUpload).mock.calls[0][1];expect(form.get("image")).toBeInstanceOf(File);});});