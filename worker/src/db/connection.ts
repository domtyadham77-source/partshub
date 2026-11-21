/** Small, typed helpers for Cloudflare D1. Keep SQL parameterized. */
export interface D1Result<T> {
  results?: T[];
  success: boolean;
  meta: { changes?: number; duration?: number; last_row_id?: number; [key: string]: unknown };
}
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
export interface D1DatabaseLike {
  prepare(query: string): D1Statement;
  batch<T = Record<string, unknown>>(statements: D1Statement[]): Promise<D1Result<T>[]>;
  exec?(query: string): Promise<unknown>;
}
export interface DatabaseEnv { DB: D1DatabaseLike }

export function getDatabase(env: DatabaseEnv): D1DatabaseLike {
  if (!env?.DB || typeof env.DB.prepare !== "function") {
    throw new Error("Cloudflare D1 binding 'DB' is not configured.");
  }
  return env.DB;
}

export async function firstOrNull<T>(
  db: D1DatabaseLike,
  sql: string,
  values: unknown[] = [],
): Promise<T | null> {
  return db.prepare(sql).bind(...values).first<T>();
}

export async function execute(
  db: D1DatabaseLike,
  sql: string,
  values: unknown[] = [],
): Promise<D1Result> {
  return db.prepare(sql).bind(...values).run();
}

export async function executeBatch(
  db: D1DatabaseLike,
  statements: D1Statement[],
): Promise<D1Result[]> {
  if (statements.length === 0) return [];
  return db.batch(statements);
}
