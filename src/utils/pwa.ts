export const PWA_MANIFEST_URL = "/manifest.webmanifest";
export const PWA_SERVICE_WORKER_URL = "/sw.js";

export function shouldRegisterServiceWorker(isProduction: boolean, isSupported: boolean): boolean {
  return isProduction && isSupported;
}
