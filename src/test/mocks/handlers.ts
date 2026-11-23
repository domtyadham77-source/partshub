export type MockApiHandler = (request: Request) => Response | Promise<Response>;
export type MockApiRoutes = Record<string, MockApiHandler>;

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function createApiHandler(routes: MockApiRoutes): MockApiHandler {
  return async request => {
    const url = new URL(request.url);
    const key = `${request.method.toUpperCase()} ${url.pathname}`;
    const handler = routes[key];
    return handler ? handler(request) : jsonResponse({ error: { code: "NOT_FOUND", message: "Mock route not found." } }, 404);
  };
}
