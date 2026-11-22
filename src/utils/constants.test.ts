import { describe, expect, it } from "vitest";
import {
  APP_NAME,
  CURRENCY,
  MAX_CART_QUANTITY,
  MAX_PRODUCT_IMAGE_BYTES,
  MAX_PRODUCT_IMAGES,
  PIASTERS_PER_POUND,
  ROUTE_PATHS,
  SESSION_REMINDER_DAYS,
} from "./constants";

describe("application constants", () => {
  it("exposes the expected app and currency configuration", () => {
    expect(APP_NAME).toBe("Parts Hub");
    expect(CURRENCY).toBe("EGP");
    expect(PIASTERS_PER_POUND).toBe(100);
  });

  it("keeps product image and cart limits explicit", () => {
    expect(MAX_PRODUCT_IMAGE_BYTES).toBe(1_000_000);
    expect(MAX_PRODUCT_IMAGES).toBe(1);
    expect(MAX_CART_QUANTITY).toBe(99);
  });

  it("sets the session reminder period", () => {
    expect(SESSION_REMINDER_DAYS).toBe(14);
  });

  it("provides the expected application routes", () => {
    expect(ROUTE_PATHS).toEqual({
      home: "/", cars: "/cars", motorcycles: "/motorcycles",
      workshops: "/workshops", cart: "/cart", checkout: "/checkout",
      orders: "/orders", account: "/account", favorites: "/favorites",
      notifications: "/notifications", support: "/support",
      login: "/login", register: "/register",
    });
  });
});
