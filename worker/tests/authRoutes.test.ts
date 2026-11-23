import { describe, expect, it } from "vitest";
import { matchesAuthRoute } from "../src/routes/auth";

describe("authentication route registration", () => {
  it.each([
    ["/api/auth/me", "GET"],
    ["/api/auth/logout", "POST"],
    ["/api/auth/register", "POST"],
    ["/api/auth/login", "POST"],
    ["/api/auth/forgot-password", "POST"],
  ])("registers %s %s", (path, method) => {
    expect(matchesAuthRoute(path, method)).toBe(true);
  });

  it.each([
    ["/api/auth/me", "POST"],
    ["/api/auth/login", "GET"],
    ["/api/products", "GET"],
    ["/api/auth/unknown", "POST"],
  ])("does not claim unrelated request %s %s", (path, method) => {
    expect(matchesAuthRoute(path, method)).toBe(false);
  });
});
