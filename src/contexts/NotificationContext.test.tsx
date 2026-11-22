import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider, useNotifications } from "./NotificationContext";

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
  { id: "n-2", title: "Order update", message: "Updated", type: "success" as const, read_at: "2026-01-02", created_at: "2026-01-02" },
];

function Probe() {
  const { items: notifications, unreadCount, refresh } = useNotifications();
  return <div>
    <output data-testid="unread">{unreadCount}</output>
    <output data-testid="count">{notifications.length}</output>
    <button onClick={() => void refresh()}>Refresh</button>
  </div>;
}

describe("NotificationProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.me).mockResolvedValue({ user });
    vi.mocked(notificationsService.list).mockResolvedValue({ items });
  });

  it("loads notifications for the signed-in user and counts unread items", async () => {
    render(<AuthProvider><NotificationProvider><Probe /></NotificationProvider></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId("count")).toHaveTextContent("2"));
    expect(screen.getByTestId("unread")).toHaveTextContent("1");
    expect(notificationsService.list).toHaveBeenCalled();
  });

  it("refreshes the notification list when requested", async () => {
    render(<AuthProvider><NotificationProvider><Probe /></NotificationProvider></AuthProvider>);
    await waitFor(() => expect(notificationsService.list).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(notificationsService.list).toHaveBeenCalledTimes(2));
  });
});
