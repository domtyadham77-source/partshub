import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {supportService} from "./support";
describe("supportService",()=>{beforeEach(()=>vi.clearAllMocks());
it("lists and creates support tickets",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[]});const input={category:"orders",subject:"Order issue",message:"Please help"};await supportService.list();await supportService.create(input);expect(apiRequest).toHaveBeenNthCalledWith(1,"/support/tickets");expect(apiRequest).toHaveBeenNthCalledWith(2,"/support/tickets",{method:"POST",body:input});});
it("filters and updates tickets in the admin inbox",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[]});await supportService.adminList("resolved");await supportService.update("ticket/1","in_progress","Reviewing");expect(apiRequest).toHaveBeenNthCalledWith(1,"/admin/support?status=resolved");expect(apiRequest).toHaveBeenNthCalledWith(2,"/admin/support/ticket%2F1",{method:"POST",body:{status:"in_progress",adminNote:"Reviewing"}});});
});