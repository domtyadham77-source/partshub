import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../App", () => ({
  default: () => <main>Parts Hub home content</main>,
}));

import HomePage from "./HomePage";

describe("HomePage compatibility entry", () => {
  it("renders the shared marketplace homepage", () => {
    render(<HomePage />);
    expect(screen.getByRole("main")).toHaveTextContent("Parts Hub home content");
  });
});
