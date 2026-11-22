import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("../utils/storage",()=>({storage:{get:vi.fn(),set:vi.fn(),remove:vi.fn()}}));
import {storage} from "../utils/storage";
import {cartService} from "./cart";
describe("cartService",()=>{beforeEach(()=>vi.clearAllMocks());
it("loads the cart with an empty fallback",()=>{vi.mocked(storage.get).mockReturnValue([]);expect(cartService.list()).toEqual([]);expect(storage.get).toHaveBeenCalledWith("partshub.cart.v1",[]);});
it("saves cart lines and clears the persisted cart",()=>{vi.mocked(storage.set).mockReturnValue(true);cartService.save([]);cartService.clear();expect(storage.set).toHaveBeenCalledWith("partshub.cart.v1",[]);expect(storage.remove).toHaveBeenCalledWith("partshub.cart.v1");});
});