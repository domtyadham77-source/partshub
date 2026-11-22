import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./formatDate";

describe("formatDate", () => {
  it("formats valid Date, string, and numeric timestamp inputs", () => {
    const date = new Date("2025-01-15T12:00:00.000Z");
    const expected = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
    expect(formatDate(date, "en-US")).toBe(expected);
    expect(formatDate("2025-01-15T12:00:00.000Z", "en-US")).toBe(expected);
    expect(formatDate(date.getTime(), "en-US")).toBe(expected);
  });

  it("returns an em dash for invalid date values", () => {
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("honors custom Intl date options", () => {
    const date = new Date("2025-01-15T12:00:00.000Z");
    const options: Intl.DateTimeFormatOptions = { year: "numeric" };
    expect(formatDate(date, "en-US", options)).toBe(
      new Intl.DateTimeFormat("en-US", options).format(date)
    );
  });
});

describe("formatDateTime", () => {
  it("includes both date and time using the requested locale", () => {
    const date = new Date("2025-01-15T12:00:00.000Z");
    const expected = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium", timeStyle: "short",
    }).format(date);
    expect(formatDateTime(date, "en-US")).toBe(expected);
  });

  it("returns an em dash for invalid date-time values", () => {
    expect(formatDateTime("invalid")).toBe("—");
  });
});
