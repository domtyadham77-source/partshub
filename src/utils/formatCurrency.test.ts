import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats EGP using the default locale and zero fraction digits", () => {
    const expected = new Intl.NumberFormat("en-EG", {
      style: "currency", currency: "EGP", maximumFractionDigits: 0,
    }).format(1250);
    expect(formatCurrency(1250)).toBe(expected);
  });

  it("supports a caller-provided currency and locale", () => {
    const expected = new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(42);
    expect(formatCurrency(42, "USD", "en-US")).toBe(expected);
  });

  it("rounds to whole currency units by default", () => {
    expect(formatCurrency(12.6, "USD", "en-US")).toBe("$13");
  });

  it("handles zero and negative values", () => {
    expect(formatCurrency(0, "USD", "en-US")).toBe("$0");
    expect(formatCurrency(-5, "USD", "en-US")).toBe("-$5");
  });
});
