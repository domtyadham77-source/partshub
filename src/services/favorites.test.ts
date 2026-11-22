import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("../utils/storage",()=>({storage:{get:vi.fn(),set:vi.fn(),remove:vi.fn()}}));
import {storage} from "../utils/storage";
import {favoritesService} from "./favorites";
describe("favoritesService",()=>{beforeEach(()=>vi.clearAllMocks());
it("lists saved ids and checks membership",()=>{vi.mocked(storage.get).mockReturnValue(["p1"]);expect(favoritesService.list()).toEqual(["p1"]);expect(favoritesService.has("p1")).toBe(true);expect(favoritesService.has("p2")).toBe(false);});
it("adds and removes favorites when toggled",()=>{vi.mocked(storage.get).mockReturnValueOnce(["p1"]).mockReturnValueOnce(["p1","p2"]);expect(favoritesService.toggle("p2")).toEqual(["p1","p2"]);expect(storage.set).toHaveBeenCalledWith("partshub.favorites.v1",["p1","p2"]);expect(favoritesService.toggle("p2")).toEqual(["p1"]);expect(storage.set).toHaveBeenLastCalledWith("partshub.favorites.v1",["p1"]);});
it("clears saved favorites",()=>{favoritesService.clear();expect(storage.remove).toHaveBeenCalledWith("partshub.favorites.v1");});
});