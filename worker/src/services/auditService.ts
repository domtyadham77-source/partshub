import type { D1DatabaseLike } from "../db/connection";
import { listAuditLogs, writeAuditLog, type AuditLogInput } from "../db/repositories/auditLogRepository";

export type { AuditLogInput };
export function recordAuditEvent(db: D1DatabaseLike, input: AuditLogInput): Promise<void> {
  return writeAuditLog(db, input);
}
export function getAuditEvents(db: D1DatabaseLike, options?: { limit?: number; before?: string; entityType?: string }) {
  return listAuditLogs(db, options);
}
