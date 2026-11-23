import { beforeEach, describe, expect, it } from "vitest";
import { cartService } from "../../services/cart";

describe("cart persistence workflow", () => {
  beforeEach(() => localStorage.clear());
  it("saves, restores and clears cart lines", () => {
    const lines = [{ product: { id: "p1" } as never, quantity: 2 }];
    cartService.save(lines);
    expect(cartService.list()).toEqual(lines);
    cartService.clear();
    expect(cartService.list()).toEqual([]);
  });
});
