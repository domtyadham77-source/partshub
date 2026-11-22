import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CartProvider } from "../contexts/CartContext";
import { useCart } from "./useCart";
import type { Product } from "../types/product";

const product: Product = {
  id: "part-1", name: "Brake pad set", category: "Car parts",
  fitment: "Sedan 2020", price: 1250, seller: "Test Store",
  description: "Test product", stockStatus: "in-stock",
};

describe("useCart", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("adds products and calculates item count and subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => { result.current.addItem(product); });
    expect(result.current.count).toBe(1);
    expect(result.current.subtotal).toBe(1250);
    expect(result.current.items[0].product.id).toBe(product.id);
  });

  it("updates quantities, removes items, and clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => { result.current.addItem(product); });
    act(() => { result.current.setQuantity(product.id, 3); });
    expect(result.current.count).toBe(3);
    act(() => { result.current.removeItem(product.id); });
    expect(result.current.items).toHaveLength(0);
    act(() => { result.current.addItem(product); result.current.clear(); });
    expect(result.current.count).toBe(0);
  });
});
