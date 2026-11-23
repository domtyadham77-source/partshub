import type { D1DatabaseLike } from "../db/connection";
import { createNotification, listNotifications, markNotificationRead } from "../db/repositories/notificationRepository";

export { createNotification, listNotifications, markNotificationRead };
export async function markAllNotificationsRead(db: D1DatabaseLike, userId: string): Promise<number> {
  const result = await db.prepare("UPDATE notifications SET read_at=COALESCE(read_at, ?) WHERE user_id=? AND read_at IS NULL")
    .bind(new Date().toISOString(), userId).run();
  return result.meta.changes ?? 0;
}
