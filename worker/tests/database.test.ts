import { describe, expect, it } from "vitest";
import { execute, executeBatch, firstOrNull, getDatabase } from "../src/db/connection";
import { clampLimit, normalizeSearch, placeholders } from "../src/db/queries";
import { createMockD1Database } from "./helpers/mockBindings";

describe("D1 helpers", () => {
  it("requires a configured D1 binding", () => {
    expect(() => getDatabase({ DB: undefined as never })).toThrow("D1 binding 'DB' is not configured.");
  });
  it("reads a single row with bound parameters", async () => {
    const { db, calls } = createMockD1Database([{ first: { id: "u1" } }]);
    await expect(firstOrNull(db, "SELECT * FROM users WHERE id=?", ["u1"])).resolves.toEqual({ id: "u1" });
    expect(calls[0]).toEqual({ sql: "SELECT * FROM users WHERE id=?", values: ["u1"] });
  });
  it("executes parameterized statements and returns the change count", async () => {
    const { db } = createMockD1Database([{ changes: 2 }]);
    const result = await execute(db, "UPDATE users SET status=? WHERE id=?", ["active", "u1"]);
    expect(result.meta.changes).toBe(2);
  });
  it("runs a batch of prepared statements", async () => {
    const { db } = createMockD1Database([{ changes: 1 }, { changes: 1 }]);
    const results = await executeBatch(db, [db.prepare("DELETE FROM sessions").bind(), db.prepare("DELETE FROM auth_attempts").bind()]);
    expect(results).toHaveLength(2);
  });
  it("validates SQL placeholders and clamps untrusted limits", () => {
    expect(placeholders(3)).toBe("?, ?, ?");
    expect(() => placeholders(0)).toThrow(RangeError);
    expect(clampLimit("500", 25, 100)).toBe(100);
    expect(clampLimit("not-a-number", 20)).toBe(20);
    expect(normalizeSearch("  part\n\u0000name  ")).toBe("partname");
  });
});
