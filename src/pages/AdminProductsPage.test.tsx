import { describe, expect, it } from "vitest";
import Page from "./AdminProductsPage";

describe("AdminProductsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
