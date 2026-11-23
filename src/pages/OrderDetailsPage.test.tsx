import { describe, expect, it } from "vitest";
import Page from "./OrderDetailsPage";

describe("OrderDetailsPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
