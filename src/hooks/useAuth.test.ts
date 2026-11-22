import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "./useAuth";

vi.mock("../services/auth", () => ({ authService: {
  me: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn(),
} }));
import { authService } from "../services/auth";

const user = {
  id: "user-1", fullName: "Test User", email: "test@example.com",
  phone: null, role: "customer" as const, status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.me).mockResolvedValue({ user: null });
    vi.mocked(authService.login).mockResolvedValue({ user });
    vi.mocked(authService.logout).mockResolvedValue({ success: true });
  });

  it("loads the current user when the provider mounts", async () => {
    vi.mocked(authService.me).mockResolvedValue({ user });
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(user);
  });

  it("updates the user after login and clears it after logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.login("test@example.com", "password"); });
    expect(result.current.user).toEqual(user);
    await act(async () => { await result.current.logout(); });
    expect(result.current.user).toBeNull();
  });
});
