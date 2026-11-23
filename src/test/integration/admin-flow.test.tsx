import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { adminService } from "../../services/admin";

describe("admin workflow service", () => {
  it("submits a merchant approval to the protected admin endpoint", async () => {
    apiRequest.mockResolvedValue({ success: true, status: "active" });
    await adminService.setMerchantStatus("merchant/1", "active");
    expect(apiRequest).toHaveBeenCalledWith("/admin/merchants/merchant%2F1/status", { method: "POST", body: { status: "active" } });
  });
});
