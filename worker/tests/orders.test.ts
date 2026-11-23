import { describe, expect, it } from "vitest";
import { findOrderForCustomer, findOrderForMerchant, listCustomerOrders, updateOrderStatus } from "../src/db/repositories/orderRepository";
import { createMockD1Database } from "./helpers/mockBindings";

describe("order repository", () => {
  it("scopes customer order reads to the customer id", async () => {
    const row = { id: "o1", customer_id: "u1" };
    const { db, calls } = createMockD1Database([{ first: row }]);
    await expect(findOrderForCustomer(db, "o1", "u1")).resolves.toBe(row);
    expect(calls[0].values).toEqual(["o1", "u1"]);
  });
  it("scopes merchant order reads to the merchant id", async () => {
    const { db, calls } = createMockD1Database([{ first: null }]);
    await expect(findOrderForMerchant(db, "o1", "m1")).resolves.toBeNull();
    expect(calls[0].values).toEqual(["o1", "m1"]);
  });
  it("clamps the customer order list limit", async () => {
    const { db, calls } = createMockD1Database([{ rows: [] }]);
    await expect(listCustomerOrders(db, "u1", 500)).resolves.toEqual([]);
    expect(calls[0].values).toEqual(["u1", 100]);
  });
  it("uses an expected status for guarded order transitions", async () => {
    const { db, calls } = createMockD1Database([{ changes: 1 }]);
    await expect(updateOrderStatus(db, "o1", "shipped", "processing")).resolves.toBe(true);
    expect(calls[0].sql).toContain("AND status=?");
    expect(calls[0].values).toEqual(["shipped", expect.any(String), "o1", "processing"]);
  });
});

import { matchesOrdersRoute } from "../src/routes/orders";

describe("customer order route matching",()=>{
  it.each([["/api/orders","GET"],["/api/orders","POST"],["/api/orders/order-1","GET"],["/api/orders/order-1/cancel","POST"]])("claims %s %s",(path,method)=>expect(matchesOrdersRoute(path,method)).toBe(true));
  it.each([["/api/orders","DELETE"],["/api/merchant/orders","GET"],["/api/products","GET"]])("does not claim %s %s",(path,method)=>expect(matchesOrdersRoute(path,method)).toBe(false));
});
