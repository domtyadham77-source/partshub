import { describe, expect, it } from "vitest";
import Page from "./AdminOrdersPage";

describe("AdminOrdersPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
