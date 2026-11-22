import { describe, expect, it } from "vitest";
import { validators } from "./validators";

describe("validators", () => {
  describe("email", () => {
    it("accepts a conventional email and trims surrounding whitespace", () => {
      expect(validators.email(" person@example.com ")).toBe(true);
    });
    it.each(["", "plain-text", "a@", "@example.com", "a b@example.com"])(
      "rejects invalid email: %s", value => expect(validators.email(value)).toBe(false)
    );
    it("rejects addresses longer than 254 characters", () => {
      expect(validators.email(`${"a".repeat(245)}@example.com`)).toBe(false);
    });
  });

  describe("password", () => {
    it("accepts lengths from 10 through 128 characters", () => {
      expect(validators.password("1234567890")).toBe(true);
      expect(validators.password("p".repeat(128))).toBe(true);
    });
    it("rejects passwords outside the configured length range", () => {
      expect(validators.password("123456789")).toBe(false);
      expect(validators.password("p".repeat(129))).toBe(false);
    });
  });

  describe("fullName", () => {
    it("accepts names with at least two trimmed characters", () => {
      expect(validators.fullName(" Ali ")).toBe(true);
    });
    it("rejects empty, too-short, and overlong names", () => {
      expect(validators.fullName(" ")).toBe(false);
      expect(validators.fullName("A")).toBe(false);
      expect(validators.fullName("x".repeat(91))).toBe(false);
    });
  });

  describe("phone", () => {
    it("allows an empty optional phone number and common phone characters", () => {
      expect(validators.phone("")).toBe(true);
      expect(validators.phone("+20 (100) 123-4567")).toBe(true);
    });
    it("rejects letters and values outside the accepted length", () => {
      expect(validators.phone("123ABC456")).toBe(false);
      expect(validators.phone("123")).toBe(false);
    });
  });

  describe("positiveMoney", () => {
    it.each([1, 0.5, 100_000_000])("accepts valid amount %s", value => {
      expect(validators.positiveMoney(value)).toBe(true);
    });
    it.each([0, -1, 100_000_001, Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects invalid amount %s", value => expect(validators.positiveMoney(value)).toBe(false)
    );
  });

  describe("quantity", () => {
    it.each([1, 2, 99])("accepts integer quantity %s", value => {
      expect(validators.quantity(value)).toBe(true);
    });
    it.each([0, -1, 1.5, 100, Number.NaN])(
      "rejects invalid quantity %s", value => expect(validators.quantity(value)).toBe(false)
    );
  });
});
