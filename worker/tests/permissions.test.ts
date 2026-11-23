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

import { matchesSupportRoute } from "../src/routes/support";

describe("support ticket route matching",()=>{
  it.each([["/api/support/tickets","GET"],["/api/support/tickets","POST"]])("claims %s %s",(path,method)=>expect(matchesSupportRoute(path,method)).toBe(true));
  it.each([["/api/support/tickets/1","GET"],["/api/support","GET"],["/api/orders","POST"]])("does not claim %s %s",(path,method)=>expect(matchesSupportRoute(path,method)).toBe(false));
});

import { matchesAdminRoute } from "../src/routes/admin";
import { matchesMerchantRoute } from "../src/routes/merchants";

describe("admin route matching",()=>{it("claims admin API methods",()=>{expect(matchesAdminRoute("/api/admin/users","GET")).toBe(true);expect(matchesAdminRoute("/api/admin/users/u1","POST")).toBe(true);expect(matchesAdminRoute("/api/admin/users","DELETE")).toBe(false);});});
describe("merchant route matching",()=>{it("claims supported merchant API methods",()=>{expect(matchesMerchantRoute("/api/merchant/profile","GET")).toBe(true);expect(matchesMerchantRoute("/api/merchant/products/p1","PATCH")).toBe(true);expect(matchesMerchantRoute("/api/merchant/orders/o1","POST")).toBe(true);expect(matchesMerchantRoute("/api/products","GET")).toBe(false);});});

import { matchesFavoritesRoute } from "../src/routes/favorites";
import { matchesUsersRoute } from "../src/routes/users";
describe("favorites route matching",()=>{it("claims user-owned favorite operations",()=>{expect(matchesFavoritesRoute("/api/favorites","GET")).toBe(true);expect(matchesFavoritesRoute("/api/favorites/p1","POST")).toBe(true);expect(matchesFavoritesRoute("/api/favorites/p1","DELETE")).toBe(true);expect(matchesFavoritesRoute("/api/favorites/p1","GET")).toBe(false);});});
describe("user route matching",()=>{it("claims the signed-in profile endpoint",()=>{expect(matchesUsersRoute("/api/users/me","GET")).toBe(true);expect(matchesUsersRoute("/api/users/me","POST")).toBe(false);});});
