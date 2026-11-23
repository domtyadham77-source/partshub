import { describe, expect, it, vi } from "vitest";
const { apiUpload } = vi.hoisted(() => ({ apiUpload: vi.fn() }));
vi.mock("../../services/api", () => ({ apiUpload }));
import { uploadsService } from "../../services/uploads";

describe("product image upload workflow", () => {
  it("sends the selected image as multipart form data", async () => {
    apiUpload.mockResolvedValue({ imageUrl: "/api/images/image-1" });
    const image = new Blob(["image-bytes"], { type: "image/jpeg" });
    await uploadsService.uploadProductImage("product/1", image);
    const [path, form] = apiUpload.mock.calls[0];
    expect(path).toBe("/merchant/products/product%2F1/image");
    expect(form.get("image")).toBeInstanceOf(Blob);
  });
});
