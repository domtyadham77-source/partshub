CREATE TABLE IF NOT EXISTS notifications (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_by TEXT REFERENCES users(id),
 title TEXT NOT NULL,
 message TEXT NOT NULL,
 type TEXT NOT NULL DEFAULT 'info' CHECK(type IN ('info','success','warning')),
 read_at TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id,created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id,read_at);
