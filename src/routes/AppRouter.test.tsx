import { describe, expect, it } from "vitest";
import AppRouter from "./AppRouter";

describe("AppRouter", () => {
  it("exports the application's route component", () => {
    expect(AppRouter).toBeTypeOf("function");
  });
});
