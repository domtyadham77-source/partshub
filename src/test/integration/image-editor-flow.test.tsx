import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
vi.mock("react-easy-crop", () => ({ default: () => <div data-testid="crop-surface" /> }));
import ProductImageEditor from "../../components/products/ProductImageEditor";

describe("product image editor workflow", () => {
  it("exposes an accessible crop dialog and zoom control", () => {
    render(<ProductImageEditor imageSrc="data:image/png;base64,AA==" onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Edit product image" })).toBeInTheDocument();
    expect(screen.getByLabelText("Zoom")).toBeInTheDocument();
    expect(screen.getByTestId("crop-surface")).toBeInTheDocument();
  });
});
