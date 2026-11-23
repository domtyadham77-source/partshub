import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { authService } from "../../services/auth";

describe("authentication workflow service", () => {
  it("sends the administrator password to the login endpoint", async () => {
    apiRequest.mockResolvedValue({ user: { id: "admin-1" } });
    await authService.login("correct-password");
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { password: "correct-password" } });
  });
});
