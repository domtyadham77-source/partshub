import { describe, expect, it } from "vitest";
import { consumePasswordResetToken, issuePasswordResetToken } from "../src/services/passwordResetService";
import { createMockD1Database } from "./helpers/mockBindings";

describe("password reset tokens", () => {
  it("issues a random one-time token with a ten-minute expiry", async () => {
    const { db, calls } = createMockD1Database([{ changes: 1 }, { changes: 1 }]);
    const before = Date.now();
    const issued = await issuePasswordResetToken(db, "u1");
    expect(issued.token).toMatch(/^[A-Za-z0-9]{12}$/);
    expect(new Date(issued.expiresAt).getTime()).toBeGreaterThanOrEqual(before + 9 * 60_000);
    expect(new Date(issued.expiresAt).getTime()).toBeLessThanOrEqual(Date.now() + 10 * 60_000);
    expect(calls).toHaveLength(2);
    expect(calls[0].sql).toContain("UPDATE password_reset_tokens");
    expect(calls[1].sql).toContain("INSERT INTO password_reset_tokens");
  });
  it("rejects malformed tokens without touching the database", async () => {
    const { db, calls } = createMockD1Database();
    await expect(consumePasswordResetToken(db, "bad-token")).resolves.toBeNull();
    expect(calls).toHaveLength(0);
  });
  it("consumes a valid token only when the conditional update changes one row", async () => {
    const { db, calls } = createMockD1Database([
      { first: { id: "reset-1", user_id: "u1" } },
      { changes: 1 },
    ]);
    await expect(consumePasswordResetToken(db, "Abcdef123456")).resolves.toBe("u1");
    expect(calls[0].sql).toContain("consumed_at IS NULL");
    expect(calls[1].sql).toContain("consumed_at IS NULL");
  });
  it("does not return the user when another request already consumed the token", async () => {
    const { db } = createMockD1Database([
      { first: { id: "reset-1", user_id: "u1" } },
      { changes: 0 },
    ]);
    await expect(consumePasswordResetToken(db, "Abcdef123456")).resolves.toBeNull();
  });
});
