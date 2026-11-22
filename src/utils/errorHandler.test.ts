import { describe, expect, it } from "vitest";
import { ApiRequestError } from "../services/api";
import { getErrorMessage, isUnauthorized } from "./errorHandler";

describe("getErrorMessage", () => {
  it("returns the message from an API request error", () => {
    const error = new ApiRequestError("Invalid request", 400, "BAD_REQUEST");
    expect(getErrorMessage(error)).toBe("Invalid request");
  });

  it("returns the message from a regular Error", () => {
    expect(getErrorMessage(new Error("Unexpected failure"))).toBe("Unexpected failure");
  });

  it("uses the default fallback for unknown values", () => {
    expect(getErrorMessage(null)).toBe("Something went wrong. Please try again.");
    expect(getErrorMessage("failure")).toBe("Something went wrong. Please try again.");
  });

  it("supports a custom fallback for unknown values", () => {
    expect(getErrorMessage(undefined, "Please retry")).toBe("Please retry");
  });
});

describe("isUnauthorized", () => {
  it("returns true only for API errors with HTTP status 401", () => {
    expect(isUnauthorized(new ApiRequestError("Unauthorized", 401))).toBe(true);
    expect(isUnauthorized(new ApiRequestError("Forbidden", 403))).toBe(false);
    expect(isUnauthorized(new Error("Unauthorized"))).toBe(false);
  });
});
