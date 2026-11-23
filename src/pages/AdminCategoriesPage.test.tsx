import { describe, expect, it } from "vitest";
import Page from "./AdminCategoriesPage";

describe("AdminCategoriesPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
