import { beforeEach, describe, expect, it, vi } from "vitest";
import type { D1DatabaseLike } from "../src/db/connection";

const mocks = vi.hoisted(() => ({
  getAvailableCartProducts: vi.fn(),
  validateCart: vi.fn(),
}));
vi.mock("../src/db/repositories/cartRepository", () => mocks);

import { calculateCart, getAvailableCartProducts, validateCart } from "../src/services/cartService";

const db = {} as D1DatabaseLike;
describe("cart service", () => {
  beforeEach(() => vi.clearAllMocks());
  it("delegates product lookup to the repository", async () => {
    mocks.getAvailableCartProducts.mockResolvedValue([{ id: "p1" }]);
    await expect(getAvailableCartProducts(db, ["p1"])).resolves.toEqual([{ id: "p1" }]);
    expect(mocks.getAvailableCartProducts).toHaveBeenCalledWith(db, ["p1"]);
  });
  it("exposes repository cart validation", async () => {
    const result = { valid: true, items: [], subtotalPiasters: 0 };
    mocks.validateCart.mockResolvedValue(result);
    await expect(validateCart(db, [])).resolves.toBe(result);
  });
  it("returns a validated cart summary", async () => {
    const result = { valid: true, items: [], subtotalPiasters: 0 };
    mocks.validateCart.mockResolvedValue(result);
    await expect(calculateCart(db, [])).resolves.toBe(result);
  });
  it("rejects invalid carts with the repository reason", async () => {
    mocks.validateCart.mockResolvedValue({ valid: false, items: [], subtotalPiasters: 0, error: "Out of stock." });
    await expect(calculateCart(db, [])).rejects.toThrow("Out of stock.");
  });
});
