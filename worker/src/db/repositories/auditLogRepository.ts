import type { D1DatabaseLike } from "../connection";

export interface AuditLogInput {
  id?: string; actorUserId?: string | null; action: string; entityType: string;
  entityId?: string | null; details?: Record<string, unknown>; ipHash?: string | null;
}
export async function writeAuditLog(db: D1DatabaseLike, input: AuditLogInput): Promise<void> {
  const action=input.action.trim(), entityType=input.entityType.trim();
  if (!action || action.length>120 || !entityType || entityType.length>80) throw new Error("Invalid audit log action or entity type.");
  const details=JSON.stringify(input.details ?? {});
  if (details.length>8000) throw new Error("Audit log details are too large.");
  await db.prepare("INSERT INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,details_json,ip_hash) VALUES(?,?,?,?,?,?,?)")
    .bind(input.id ?? crypto.randomUUID(),input.actorUserId ?? null,action,entityType,input.entityId ?? null,details,input.ipHash ?? null).run();
}
export async function listAuditLogs(db:D1DatabaseLike, options:{limit?:number;before?:string;entityType?:string}={}){
  const limit=Math.min(100,Math.max(1,Math.trunc(options.limit ?? 50)));
  let sql="SELECT id,actor_user_id,action,entity_type,entity_id,details_json,ip_hash,created_at FROM audit_logs WHERE 1=1";
  const values:(string|number)[]=[];
  if(options.before){sql+=" AND created_at < ?";values.push(options.before);}
  if(options.entityType){sql+=" AND entity_type = ?";values.push(options.entityType);}
  sql+=" ORDER BY created_at DESC LIMIT ?";values.push(limit);
  return (await db.prepare(sql).bind(...values).all()).results ?? [];
}