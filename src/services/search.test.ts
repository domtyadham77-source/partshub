import {afterEach,describe,expect,it,vi} from "vitest";
vi.mock("./products",()=>({productsService:{list:vi.fn()}}));
import {productsService} from "./products";
import {searchProducts} from "./search";
const products=[{id:"1",name:"Brake Pad",fitment:"Sedan",seller:"Alpha",description:"Front set"},{id:"2",name:"Oil Filter",fitment:"SUV",seller:"Beta",description:"Engine"}] as never[];
describe("searchProducts",()=>{afterEach(()=>vi.clearAllMocks());
it("returns all products for an empty query",async()=>{vi.mocked(productsService.list).mockResolvedValue(products);await expect(searchProducts("  ")).resolves.toEqual(products);});
it("matches query text case-insensitively across product fields",async()=>{vi.mocked(productsService.list).mockResolvedValue(products);await expect(searchProducts("BRAKE")).resolves.toEqual([products[0]]);await expect(searchProducts("beta")).resolves.toEqual([products[1]]);});
});