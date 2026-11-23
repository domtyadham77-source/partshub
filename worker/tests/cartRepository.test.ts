import { describe, expect, it } from "vitest";
import { validateCart } from "../src/db/repositories/cartRepository";
import { createMockD1Database } from "./helpers/mockBindings";
import { makeProduct } from "./helpers/factories";

describe("cart repository", () => {
  it("validates stock and calculates totals in piasters", async () => {
    const product = makeProduct();
    const { db } = createMockD1Database([{ rows: [product] }]);
    const result = await validateCart(db, [{ productId: product.id as string, quantity: 2 }]);
    expect(result.valid).toBe(true);
    expect(result.subtotalPiasters).toBe(250000);
    expect(result.items[0].lineTotalPiasters).toBe(250000);
  });
  it("rejects quantities above available stock", async () => {
    const product = makeProduct({ stock_quantity: 1 });
    const { db } = createMockD1Database([{ rows: [product] }]);
    const result = await validateCart(db, [{ productId: product.id as string, quantity: 2 }]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Insufficient stock");
  });
  it("rejects invalid cart lines before querying D1", async () => {
    const { db, calls } = createMockD1Database();
    const result = await validateCart(db, [{ productId: "p1", quantity: 0 }]);
    expect(result.valid).toBe(false);
    expect(calls).toHaveLength(0);
  });
  it("rejects products that are no longer available", async () => {
    const { db } = createMockD1Database([{ rows: [] }]);
    const result = await validateCart(db, [{ productId: "missing", quantity: 1 }]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("unavailable");
  });
});
