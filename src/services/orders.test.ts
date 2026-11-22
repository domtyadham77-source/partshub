import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("./api",()=>({apiRequest:vi.fn()}));
import {apiRequest} from "./api";
import {ordersService} from "./orders";
describe("ordersService",()=>{beforeEach(()=>vi.clearAllMocks());
it("creates an order from cart lines and delivery details",async()=>{vi.mocked(apiRequest).mockResolvedValue({orders:[]});const lines=[{product:{id:"p1"},quantity:2}] as never;const address={recipientName:"Test",recipientPhone:"01000000000",addressLine:"Street",city:"Cairo",area:"Nasr City",notes:"Call first"};await ordersService.create(lines,address);expect(apiRequest).toHaveBeenCalledWith("/orders",{method:"POST",body:{items:[{productId:"p1",quantity:2}],...address,paymentMethod:"cash_on_delivery"}});});
it("lists, fetches, and cancels orders with encoded ids",async()=>{vi.mocked(apiRequest).mockResolvedValue({items:[]});await ordersService.list();await ordersService.get("order/1");await ordersService.cancel("order/1");expect(apiRequest).toHaveBeenNthCalledWith(1,"/orders");expect(apiRequest).toHaveBeenNthCalledWith(2,"/orders/order%2F1");expect(apiRequest).toHaveBeenNthCalledWith(3,"/orders/order%2F1/cancel",{method:"POST",body:{}});});
});