import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {productsService,toApiCategory} from "./products";
describe("productsService",()=>{beforeEach(()=>vi.clearAllMocks());
it("maps API product fields and piasters to pounds",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[{id:"p1",name:"Brake pads",category:"car_parts",fitment:"Sedan",description:"Set",pricePiasters:125000,stockQuantity:3,seller:"Store"}]});await expect(productsService.list()).resolves.toMatchObject([{id:"p1",category:"Car parts",price:1250,stockStatus:"in-stock"}]);});
it("maps a single product returned by id",async()=>{vi.mocked(apiRequest).mockResolvedValue({product:{id:"p2",name:"Chain",category:"motorcycle_parts",fitment:"Bike",description:"Chain",pricePiasters:50000,stockQuantity:0,seller:"Shop"}});await expect(productsService.get("p/2")).resolves.toMatchObject({id:"p2",category:"Motorcycle parts",price:500,stockStatus:"out-of-stock"});expect(apiRequest).toHaveBeenCalledWith("/products/p%2F2");});
it("converts frontend categories to API values",()=>{expect(toApiCategory("Car parts")).toBe("car_parts");expect(toApiCategory("Motorcycle parts")).toBe("motorcycle_parts");expect(toApiCategory("Workshop")).toBe("workshop");});
});