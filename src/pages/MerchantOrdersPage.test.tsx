import { describe, expect, it } from "vitest";
import Page from "./MerchantOrdersPage";

describe("MerchantOrdersPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
