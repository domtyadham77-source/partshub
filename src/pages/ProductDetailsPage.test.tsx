import { describe, expect, it } from "vitest";
import Page from "./ProductDetailsPage";

describe("ProductDetailsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
