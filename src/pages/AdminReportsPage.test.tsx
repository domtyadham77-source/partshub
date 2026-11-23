import { describe, expect, it } from "vitest";
import Page from "./AdminReportsPage";

describe("AdminReportsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
