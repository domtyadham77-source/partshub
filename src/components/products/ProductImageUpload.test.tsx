import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductImageUpload from "./ProductImageUpload";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

vi.mock("./ProductImageEditor", () => ({
  default: ({ onSave }: { onSave: (blob: Blob) => void }) =>
    <button type="button" onClick={() => onSave(new Blob(["edited"], { type: "image/jpeg" }))}>Apply mock crop</button>,
}));

describe("ProductImageUpload", () => {
  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:preview") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  });

  afterEach(() => {
    // Unmount while the object-URL methods are still installed; the component revokes previews on cleanup.
    cleanup();
    if (originalCreateObjectURL) Object.defineProperty(URL, "createObjectURL", { configurable: true, value: originalCreateObjectURL });
    else Reflect.deleteProperty(URL, "createObjectURL");
    if (originalRevokeObjectURL) Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: originalRevokeObjectURL });
    else Reflect.deleteProperty(URL, "revokeObjectURL");
  });

  it("rejects files that are not images", () => {
    render(<ProductImageUpload />);
    const file = new File(["text"], "note.txt", { type: "text/plain" });
    fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Choose an image file.");
  });

  it("shows the editor after choosing an image and returns the edited blob", async () => {
    const onImageReady = vi.fn();
    render(<ProductImageUpload onImageReady={onImageReady} />);
    const input = document.querySelector('input[type="file"]')!;
    const file = new File(["image"], "part.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(await screen.findByText("Apply mock crop"));
    await waitFor(() => expect(onImageReady).toHaveBeenCalledWith(expect.any(Blob)));
  });
});
