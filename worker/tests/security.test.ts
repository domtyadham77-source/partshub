import { describe, expect, it } from "vitest";
import { withSecurityHeaders } from "../src/middleware/securityHeaders";
import { cleanText, integerInRange, readJson } from "../src/middleware/validation";

describe("security and request validation", () => {
  it("adds baseline security headers without overwriting explicit values", () => {
    const response = withSecurityHeaders(new Response("ok", { headers: { "X-Frame-Options": "SAMEORIGIN" } }));
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
  it("rejects non-JSON and malformed request bodies", async () => {
    const wrongType = await readJson(new Request("https://api.test", { method: "POST", body: "{}", headers: { "Content-Type": "text/plain" } }));
    expect(wrongType.ok).toBe(false);
    if (!wrongType.ok) expect(wrongType.response.status).toBe(415);
    const invalid = await readJson(new Request("https://api.test", { method: "POST", body: "{", headers: { "Content-Type": "application/json" } }));
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.response.status).toBe(400);
  });
  it("rejects oversized and non-object JSON payloads", async () => {
    const oversized = await readJson(new Request("https://api.test", { method: "POST", body: JSON.stringify({ value: "long" }), headers: { "Content-Type": "application/json" } }), 3);
    expect(oversized.ok).toBe(false);
    const array = await readJson(new Request("https://api.test", { method: "POST", body: "[]", headers: { "Content-Type": "application/json" } }));
    expect(array.ok).toBe(false);
  });
  it("sanitizes control characters and validates integer ranges", () => {
    expect(cleanText("  part\u0000 name  ", 20, 1)).toBe("part name");
    expect(cleanText(" ", 20, 1)).toBeNull();
    expect(integerInRange("12", 1, 20)).toBe(12);
    expect(integerInRange("12.5", 1, 20)).toBeNull();
    expect(integerInRange(21, 1, 20)).toBeNull();
  });
});
