import type { D1DatabaseLike } from "../../src/db/connection";
import { createMockD1Database, type MockD1Response } from "./mockBindings";

export type TestEnv = {
  DB: D1DatabaseLike;
  ALLOWED_ORIGIN?: string;
  SESSION_TTL_DAYS?: string;
};

export function createTestEnv(responses: MockD1Response[] = [], overrides: Partial<Omit<TestEnv, "DB">> = {}) {
  const { db, calls } = createMockD1Database(responses);
  return {
    env: { DB: db, ALLOWED_ORIGIN: "https://partshub.test", ...overrides } satisfies TestEnv,
    db,
    calls,
  };
}
