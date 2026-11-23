import { describe, expect, it } from "vitest";
import Page from "./ForgotPasswordPage";

describe("ForgotPasswordPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
