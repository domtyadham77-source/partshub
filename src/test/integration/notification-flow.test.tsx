import { describe, expect, it, vi } from "vitest";
const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock("../../services/api", () => ({ apiRequest }));
import { notificationsService } from "../../services/notifications";

describe("notification workflow service", () => {
  it("marks a notification read using its encoded identifier", async () => {
    apiRequest.mockResolvedValue({ success: true });
    await notificationsService.markRead("notice/1");
    expect(apiRequest).toHaveBeenCalledWith("/notifications/notice%2F1/read", { method: "POST", body: {} });
  });
});
