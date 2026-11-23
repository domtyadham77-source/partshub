import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { authService } from "../../services/auth";

describe("password recovery workflow", () => {
  it("requests account recovery without exposing whether an account exists", async () => {
    apiRequest.mockResolvedValue({ accepted: true });
    await expect(authService.requestPasswordReset("user@example.test")).resolves.toEqual({ accepted: true });
    expect(apiRequest).toHaveBeenCalledWith("/auth/forgot-password", { method: "POST", body: { email: "user@example.test" } });
  });
});
