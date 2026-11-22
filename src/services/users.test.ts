import {describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {usersService} from "./users";
describe("usersService",()=>{it("retrieves the current authenticated user",async()=>{vi.mocked(apiRequest).mockResolvedValue({user:null});await expect(usersService.me()).resolves.toEqual({user:null});expect(apiRequest).toHaveBeenCalledWith("/auth/me");});});