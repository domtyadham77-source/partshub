import { describe, expect, it } from "vitest";
import { authenticateRequest, unauthorizedResponse } from "../src/middleware/auth";
import { createMockD1Database } from "./helpers/mockBindings";

describe("authentication middleware", () => {
  it("does not query D1 when the session cookie is missing", async () => {
    const { db, calls } = createMockD1Database();
    await expect(authenticateRequest(new Request("https://api.partshub.test/api/me"), { DB: db })).resolves.toBeNull();
    expect(calls).toHaveLength(0);
  });
  it("looks up only a hash of the supplied session token", async () => {
    const { db, calls } = createMockD1Database([{ first: null }]);
    await expect(authenticateRequest(new Request("https://api.partshub.test/api/me", {
      headers: { Cookie: "other=value; ph_session=secret-session-token" },
    }), { DB: db })).resolves.toBeNull();
    expect(calls[0].sql).toContain("token_hash");
    expect(calls[0].values[0]).not.toBe("secret-session-token");
  });
  it("returns a no-store 401 response for unauthenticated requests", async () => {
    const response = unauthorizedResponse();
    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({ error: { code: "UNAUTHENTICATED" } });
  });
});
