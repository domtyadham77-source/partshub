import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { ordersService } from "../../services/orders";

describe("order creation workflow", () => {
  it("converts cart lines to the API contract and defaults to cash on delivery", async () => {
    apiRequest.mockResolvedValue({ orders: [] });
    const product = { id: "p1", name: "Brake pads", category: "Car parts" as const, fitment: "Sedan", price: 100, seller: "Store", description: "", stockStatus: "in-stock" as const };
    const address = { recipientName: "Customer", recipientPhone: "01000000000", addressLine: "Test Street", city: "Cairo", area: "Nasr City", notes: "" };
    await ordersService.create([{ product, quantity: 2 }], address);
    expect(apiRequest).toHaveBeenCalledWith("/orders", { method: "POST", body: { items: [{ productId: "p1", quantity: 2 }], ...address, paymentMethod: "cash_on_delivery" } });
  });
});
