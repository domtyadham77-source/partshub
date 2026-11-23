import { describe, expect, it } from "vitest";
import Page from "./CartPage";

describe("CartPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
