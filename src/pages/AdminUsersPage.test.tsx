import { describe, expect, it } from "vitest";
import Page from "./AdminUsersPage";

describe("AdminUsersPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
