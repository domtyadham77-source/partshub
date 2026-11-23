import { describe, expect, it } from "vitest";
import { deleteProductImage, saveProductImage } from "../src/services/uploadService";
import { createMockD1Database } from "./helpers/mockBindings";

const bytes = new Uint8Array([1, 2, 3]).buffer;

describe("product image uploads", () => {
  it("stores supported image bytes only for the owning merchant", async () => {
    const { db, calls } = createMockD1Database([{ first: { id: "p1" } }, { changes: 1 }]);
    const id = await saveProductImage(db, { productId: "p1", merchantId: "m1", contentType: "image/png", bytes });
    expect(id).toBeTruthy();
    expect(calls[0].values).toEqual(["p1", "m1"]);
    expect(calls[1].sql).toContain("INSERT INTO product_images");
  });
  it("rejects unsupported types and oversized files before querying D1", async () => {
    const { db, calls } = createMockD1Database();
    await expect(saveProductImage(db, { productId: "p1", merchantId: "m1", contentType: "image/svg+xml", bytes })).rejects.toThrow("Only JPEG, PNG, and WebP");
    await expect(saveProductImage(db, { productId: "p1", merchantId: "m1", contentType: "image/png", bytes: new Uint8Array(1_000_001).buffer })).rejects.toThrow("1 MB");
    expect(calls).toHaveLength(0);
  });
  it("rejects a product that does not belong to the merchant", async () => {
    const { db } = createMockD1Database([{ first: null }]);
    await expect(saveProductImage(db, { productId: "p1", merchantId: "m2", contentType: "image/jpeg", bytes })).rejects.toThrow("does not belong");
  });
  it("deletes only an image belonging to the specified merchant's product", async () => {
    const { db, calls } = createMockD1Database([{ changes: 1 }]);
    await expect(deleteProductImage(db, "p1", "m1")).resolves.toBe(true);
    expect(calls[0].values).toEqual(["p1", "p1", "m1"]);
  });
});
