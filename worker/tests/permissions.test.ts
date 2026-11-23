import { describe, expect, it } from "vitest";
import { hasRole, isOwnerOrAdmin, requireRole } from "../src/middleware/permissions";
import type { AuthUser } from "../src/middleware/auth";

const customer: AuthUser = {
  id: "u1", fullName: "Customer", email: "customer@example.test", phone: null, role: "customer", status: "active",
};

describe("authorization helpers", () => {
  it("allows only active users with an explicitly permitted role", () => {
    expect(hasRole(customer, ["customer"])).toBe(true);
    expect(hasRole(customer, ["admin"])).toBe(false);
    expect(hasRole({ ...customer, status: "pending" }, ["customer"])).toBe(false);
    expect(hasRole(null, ["customer"])).toBe(false);
  });
  it("returns the appropriate authentication and authorization responses", async () => {
    expect(requireRole(null, ["admin"])?.status).toBe(401);
    expect(requireRole({ ...customer, status: "pending" }, ["customer"])?.status).toBe(403);
    expect(requireRole(customer, ["admin"])?.status).toBe(403);
    expect(requireRole({ ...customer, role: "admin" }, ["admin"])).toBeNull();
  });
  it("allows resource owners and administrators only", () => {
    expect(isOwnerOrAdmin(customer, "u1")).toBe(true);
    expect(isOwnerOrAdmin(customer, "u2")).toBe(false);
    expect(isOwnerOrAdmin({ ...customer, role: "admin" }, "u2")).toBe(true);
    expect(isOwnerOrAdmin({ ...customer, status: "suspended" }, "u1")).toBe(false);
  });
});
