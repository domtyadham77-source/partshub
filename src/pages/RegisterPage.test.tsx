import { describe, expect, it } from "vitest";
import Page from "./RegisterPage";

describe("RegisterPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
