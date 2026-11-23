import { describe, expect, it } from "vitest";
import Page from "./AdminMerchantsPage";

describe("AdminMerchantsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
