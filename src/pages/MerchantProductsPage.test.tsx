import { describe, expect, it } from "vitest";
import Page from "./MerchantProductsPage";

describe("MerchantProductsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
