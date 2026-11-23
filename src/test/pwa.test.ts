import { describe, expect, it } from "vitest";
import { PWA_MANIFEST_URL, PWA_SERVICE_WORKER_URL, shouldRegisterServiceWorker } from "../utils/pwa";

describe("PWA configuration", () => {
  it("points to the tracked manifest and service worker assets", () => {
    expect(PWA_MANIFEST_URL).toBe("/manifest.webmanifest");
    expect(PWA_SERVICE_WORKER_URL).toBe("/sw.js");
  });
  it("registers a service worker only in production-capable browsers", () => {
    expect(shouldRegisterServiceWorker(true, true)).toBe(true);
    expect(shouldRegisterServiceWorker(false, true)).toBe(false);
    expect(shouldRegisterServiceWorker(true, false)).toBe(false);
  });
});
