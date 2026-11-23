import { describe, expect, it, vi } from "vitest";
const { apiRequest, apiUpload } = vi.hoisted(() => ({ apiRequest: vi.fn(), apiUpload: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest, apiUpload }));
import { merchantService } from "../../services/merchants";

describe("merchant workflow service", () => {
  it("creates a product listing with the submitted inventory fields", async () => {
    apiRequest.mockResolvedValue({ id: "p1", status: "draft" });
    const input = { name: "Brake pads", category: "car_parts" as const, fitment: "Sedan", description: "Front axle", pricePiasters: 120000, stockQuantity: 4 };
    await merchantService.createProduct(input);
    expect(apiRequest).toHaveBeenCalledWith("/merchant/products", { method: "POST", body: input });
  });
});
