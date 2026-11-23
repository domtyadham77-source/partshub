import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../components/ui/Button";

describe("accessibility basics", () => {
  it("exposes an actionable button with its accessible name", () => {
    render(<Button aria-label="Save product">Save</Button>);
    expect(screen.getByRole("button", { name: "Save product" })).toBeInTheDocument();
  });
});
