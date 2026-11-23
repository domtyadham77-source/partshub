import { describe, expect, it } from "vitest";
import Page from "./LoginPage";

describe("LoginPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
