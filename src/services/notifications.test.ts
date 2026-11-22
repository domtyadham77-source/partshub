import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {notificationsService} from "./notifications";
describe("notificationsService",()=>{beforeEach(()=>vi.clearAllMocks());
it("lists and marks a notification as read using an encoded id",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[]});await notificationsService.list();await notificationsService.markRead("notice/1");expect(apiRequest).toHaveBeenNthCalledWith(1,"/notifications");expect(apiRequest).toHaveBeenNthCalledWith(2,"/notifications/notice%2F1/read",{method:"POST",body:{}});});
it("lists admin notifications and sends a user notification",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[]});const input={userId:"u1",title:"Update",message:"Your order changed",type:"info" as const};await notificationsService.adminList();await notificationsService.send(input);expect(apiRequest).toHaveBeenNthCalledWith(1,"/admin/notifications");expect(apiRequest).toHaveBeenNthCalledWith(2,"/admin/notifications",{method:"POST",body:input});});
});