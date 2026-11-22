import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {authService} from "./auth";
describe("authService",()=>{beforeEach(()=>vi.clearAllMocks());
it("requests the current session",async()=>{vi.mocked(apiRequest).mockResolvedValue({user:null});await expect(authService.me()).resolves.toEqual({user:null});expect(apiRequest).toHaveBeenCalledWith("/auth/me");});
it("sends login and registration payloads",async()=>{vi.mocked(apiRequest).mockResolvedValue({user:{id:"u1"}});const registration={fullName:"Test User",email:"test@example.com",password:"strong-password",role:"customer" as const};await authService.login("test@example.com","secret");await authService.register(registration);expect(apiRequest).toHaveBeenNthCalledWith(1,"/auth/login",{method:"POST",body:{email:"test@example.com",password:"secret"}});expect(apiRequest).toHaveBeenNthCalledWith(2,"/auth/register",{method:"POST",body:registration});});
it("logs out and requests password recovery",async()=>{vi.mocked(apiRequest).mockResolvedValue({success:true});await authService.logout();await authService.requestPasswordReset("test@example.com");expect(apiRequest).toHaveBeenNthCalledWith(1,"/auth/logout",{method:"POST"});expect(apiRequest).toHaveBeenNthCalledWith(2,"/auth/forgot-password",{method:"POST",body:{email:"test@example.com"}});});
});