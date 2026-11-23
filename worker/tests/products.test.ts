import { describe, expect, it } from "vitest";
import { changeStock, findProductById, listMerchantProducts, setProductStatus } from "../src/db/repositories/productRepository";
import { createMockD1Database } from "./helpers/mockBindings";

describe("product repository", () => {
  it("looks up a product by its identifier", async () => {
    const product = { id: "p1", name: "Brake pads" };
    const { db, calls } = createMockD1Database([{ first: product }]);
    await expect(findProductById(db, "p1")).resolves.toBe(product);
    expect(calls[0].values).toEqual(["p1"]);
  });
  it("limits merchant product listing to 100 rows", async () => {
    const { db, calls } = createMockD1Database([{ rows: [] }]);
    await expect(listMerchantProducts(db, "m1", 1000)).resolves.toEqual([]);
    expect(calls[0].values).toEqual(["m1", 100]);
  });
  it("scopes product status updates to the owning merchant", async () => {
    const { db, calls } = createMockD1Database([{ changes: 1 }]);
    await expect(setProductStatus(db, "p1", "m1", "active")).resolves.toBe(true);
    expect(calls[0].values[2]).toBe("p1");
    expect(calls[0].values[3]).toBe("m1");
  });
  it("prevents invalid and negative stock adjustments", async () => {
    const { db, calls } = createMockD1Database([{ changes: 0 }]);
    await expect(changeStock(db, "p1", "m1", 0)).rejects.toThrow("non-zero integer");
    await expect(changeStock(db, "p1", "m1", -2)).resolves.toBe(false);
    expect(calls[0].sql).toContain("stock_quantity+?>=0");
  });
});
