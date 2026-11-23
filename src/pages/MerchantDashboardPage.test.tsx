import { describe, expect, it } from "vitest";
import Page from "./MerchantDashboardPage";

describe("MerchantDashboardPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
