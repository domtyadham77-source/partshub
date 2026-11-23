import { describe, expect, it } from "vitest";
import Page from "./CheckoutPage";

describe("CheckoutPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
