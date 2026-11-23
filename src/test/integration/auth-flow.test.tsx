import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { authService } from "../../services/auth";

describe("authentication workflow service", () => {
  it("sends login credentials to the unified account endpoint", async () => {
    apiRequest.mockResolvedValue({ user: { id: "u1" } });
    await authService.login("user@example.test", "correct-password");
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { email: "user@example.test", password: "correct-password" } });
  });
});
