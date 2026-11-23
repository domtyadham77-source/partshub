import { describe, expect, it } from "vitest";
import type { CartItem, CartSummary } from "./cart";

describe("cart types", () => {
  it("represents product quantities and piaster totals", () => {
    const item: CartItem = { productId: "part-1", quantity: 2 };
    const summary: CartSummary = { itemCount: 2, subtotalPiasters: 250000 };
    expect(item.quantity).toBe(2);
    expect(summary.subtotalPiasters).toBe(250000);
  });
});
