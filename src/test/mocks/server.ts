import { createApiHandler, type MockApiRoutes } from "./handlers";

export function installMockApi(routes: MockApiRoutes): () => void {
  const originalFetch = globalThis.fetch;
  const handler = createApiHandler(routes);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(input, init);
    return handler(request);
  }) as typeof fetch;
  return () => { globalThis.fetch = originalFetch; };
}
