import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useNotifications } from "./useNotifications";

vi.mock("../services/auth", () => ({ authService: { me: vi.fn() } }));
vi.mock("../services/notifications", () => ({
  notificationsService: { list: vi.fn(), markRead: vi.fn() },
}));
import { authService } from "../services/auth";
import { notificationsService } from "../services/notifications";

const user = {
  id: "user-1", fullName: "Test User", email: "test@example.com",
  phone: null, role: "customer" as const, status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
};
const items = [
  { id: "n-1", title: "Welcome", message: "Hello", type: "info" as const, read_at: null, created_at: "2026-01-01" },
];

function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider><NotificationProvider>{children}</NotificationProvider></AuthProvider>;
}

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.me).mockResolvedValue({ user });
    vi.mocked(notificationsService.list).mockResolvedValue({ items });
    vi.mocked(notificationsService.markRead).mockResolvedValue({ success: true });
  });

  it("exposes the user's notifications and unread count", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper: Providers });
    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.unreadCount).toBe(1);
  });

  it("marks a notification as read and updates the unread count", async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper: Providers });
    await waitFor(() => expect(result.current.items).toHaveLength(1));
    await act(async () => { await result.current.markRead("n-1"); });
    expect(notificationsService.markRead).toHaveBeenCalledWith("n-1");
    expect(result.current.unreadCount).toBe(0);
  });
});
