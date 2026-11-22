import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("returns the fallback when a key does not exist", () => {
    expect(storage.get("missing", { enabled: false })).toEqual({ enabled: false });
  });

  it("serializes and retrieves stored values", () => {
    const value = { name: "Parts Hub", count: 3 };
    expect(storage.set("settings", value)).toBe(true);
    expect(storage.get("settings", null)).toEqual(value);
  });

  it("returns the fallback when stored JSON is malformed", () => {
    localStorage.setItem("broken", "{not-json");
    expect(storage.get("broken", "fallback")).toBe("fallback");
  });

  it("returns false when writing to storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(storage.set("key", "value")).toBe(false);
  });

  it("returns the fallback when reading from storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(storage.get("key", 7)).toBe(7);
  });

  it("removes an existing key without throwing", () => {
    localStorage.setItem("key", JSON.stringify("value"));
    storage.remove("key");
    expect(localStorage.getItem("key")).toBeNull();
  });

  it("does not throw when removing from unavailable storage", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(() => storage.remove("key")).not.toThrow();
  });
});
