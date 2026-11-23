import { beforeEach, describe, expect, it, vi } from "vitest";
import type { D1DatabaseLike } from "../src/db/connection";

const mocks = vi.hoisted(() => ({
  createNotification: vi.fn(),
  listNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
}));
vi.mock("../src/db/repositories/notificationRepository", () => mocks);

import { createNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "../src/services/notificationService";

describe("notification service", () => {
  beforeEach(() => vi.clearAllMocks());
  it("delegates create, list and read operations", async () => {
    const db = {} as D1DatabaseLike;
    mocks.createNotification.mockResolvedValue("n1");
    mocks.listNotifications.mockResolvedValue([{ id: "n1" }]);
    mocks.markNotificationRead.mockResolvedValue(true);
    await expect(createNotification(db, { userId: "u1", title: "Hello", message: "World" })).resolves.toBe("n1");
    await expect(listNotifications(db, "u1")).resolves.toEqual([{ id: "n1" }]);
    await expect(markNotificationRead(db, "u1", "n1")).resolves.toBe(true);
  });
  it("marks only the signed-in user's unread notifications as read", async () => {
    const run = vi.fn().mockResolvedValue({ meta: { changes: 3 } });
    const bind = vi.fn().mockReturnValue({ run });
    const prepare = vi.fn().mockReturnValue({ bind });
    const db = { prepare } as unknown as D1DatabaseLike;
    await expect(markAllNotificationsRead(db, "u1")).resolves.toBe(3);
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining("WHERE user_id=? AND read_at IS NULL"));
    expect(bind).toHaveBeenCalledWith(expect.any(String), "u1");
  });
});
