import { beforeEach, describe, expect, it, vi } from "vitest";
import type { D1DatabaseLike } from "../src/db/connection";

const mocks = vi.hoisted(() => ({ listAuditLogs: vi.fn(), writeAuditLog: vi.fn() }));
vi.mock("../src/db/repositories/auditLogRepository", () => mocks);

import { getAuditEvents, recordAuditEvent } from "../src/services/auditService";

describe("audit service", () => {
  beforeEach(() => vi.clearAllMocks());
  it("records audit events through the repository", async () => {
    const db = {} as D1DatabaseLike;
    mocks.writeAuditLog.mockResolvedValue(undefined);
    const input = { actorUserId: "admin-1", action: "merchant.approved", entityType: "merchant", entityId: "m1" };
    await expect(recordAuditEvent(db, input)).resolves.toBeUndefined();
    expect(mocks.writeAuditLog).toHaveBeenCalledWith(db, input);
  });
  it("returns filtered audit events", async () => {
    const db = {} as D1DatabaseLike;
    mocks.listAuditLogs.mockResolvedValue([{ id: "log-1" }]);
    const options = { limit: 10, entityType: "order" };
    await expect(getAuditEvents(db, options)).resolves.toEqual([{ id: "log-1" }]);
    expect(mocks.listAuditLogs).toHaveBeenCalledWith(db, options);
  });
});
