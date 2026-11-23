import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError, apiRequest } from "../services/api";

describe("frontend API security and error handling", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("preserves structured API error details", () => {
    const error = new ApiRequestError("Forbidden", 403, "FORBIDDEN", { role: "admin" });
    expect(error.status).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
    expect(error.fields).toEqual({ role: "admin" });
  });
  it("normalizes network failures without leaking the underlying exception", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("socket detail")));
    await expect(apiRequest("/private")).rejects.toMatchObject({
      name: "ApiRequestError", status: 0, code: "NETWORK_ERROR",
    });
  });
});
