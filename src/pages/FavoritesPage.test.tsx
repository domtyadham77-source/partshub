import { describe, expect, it } from "vitest";
import Page from "./FavoritesPage";

describe("FavoritesPage", () => {
  it("exports a loadable React page component", () => {
    expect(Page).toBeTypeOf("function");
  });
});
