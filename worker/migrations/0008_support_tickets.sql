CREATE TABLE IF NOT EXISTS support_tickets (
 id TEXT PRIMARY KEY,
 ticket_number TEXT NOT NULL UNIQUE,
 user_id TEXT NOT NULL REFERENCES users(id),
 category TEXT NOT NULL CHECK(category IN ('order','account','payment','delivery','product','other')),
 subject TEXT NOT NULL,
 message TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','resolved','closed')),
 admin_note TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_support_user ON support_tickets(user_id,created_at);
CREATE INDEX IF NOT EXISTS idx_support_status ON support_tickets(status,created_at);
