import type { D1DatabaseLike, D1Result, D1Statement } from "../../src/db/connection";

export type MockD1Response = { first?: unknown; rows?: unknown[]; changes?: number };
export type MockD1Call = { sql: string; values: unknown[] };

export function createMockD1Database(responses: MockD1Response[] = []) {
  const queue = [...responses];
  const calls: MockD1Call[] = [];
  const take = (): MockD1Response => queue.shift() ?? {};
  const db: D1DatabaseLike = {
    prepare(sql: string): D1Statement {
      const call: MockD1Call = { sql, values: [] };
      calls.push(call);
      const statement: D1Statement = {
        bind(...values: unknown[]) { call.values = values; return statement; },
        async first<T>() { return (take().first ?? null) as T | null; },
        async all<T>() {
          const response = take();
          return { success: true, results: (response.rows ?? []) as T[], meta: {} } as D1Result<T>;
        },
        async run<T>() {
          const response = take();
          return { success: true, results: [], meta: { changes: response.changes ?? 0 } } as D1Result<T>;
        },
      };
      return statement;
    },
    async batch<T>(statements: D1Statement[]) {
      return Promise.all(statements.map(statement => statement.run<T>()));
    },
  };
  return { db, calls, remainingResponses: () => queue.length };
}
