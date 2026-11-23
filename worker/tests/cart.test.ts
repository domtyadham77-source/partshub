import { describe, expect, it } from "vitest";
import { validateCart } from "../src/db/repositories/cartRepository";
import { createMockD1Database } from "./helpers/mockBindings";
import { makeProduct } from "./helpers/factories";

describe("cart validation edge cases", () => {
  it("merges repeated product lines before checking stock", async () => {
    const product = makeProduct({ stock_quantity: 5 });
    const { db } = createMockD1Database([{ rows: [product] }]);
    const result = await validateCart(db, [
      { productId: product.id, quantity: 2 },
      { productId: product.id, quantity: 3 },
    ]);
    expect(result.valid).toBe(true);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(5);
  });
  it("rejects more than 30 cart lines", async () => {
    const { db, calls } = createMockD1Database();
    const result = await validateCart(db, Array.from({ length: 31 }, (_, i) => ({ productId: String(i), quantity: 1 })));
    expect(result.valid).toBe(false);
    expect(calls).toHaveLength(0);
  });
  it("rejects quantities above the per-line maximum", async () => {
    const { db } = createMockD1Database();
    const result = await validateCart(db, [{ productId: "p1", quantity: 100 }]);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid cart line");
  });
});

import { matchesCartRoute } from "../src/routes/cart";
describe("cart route matching",()=>{it("claims cart validation only",()=>{expect(matchesCartRoute("/api/cart/validate","POST")).toBe(true);expect(matchesCartRoute("/api/cart/validate","GET")).toBe(false);expect(matchesCartRoute("/api/cart","POST")).toBe(false);});});
