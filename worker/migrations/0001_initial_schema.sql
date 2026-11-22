-- Foundational settings and audit tables. User tables are created by migration 0003.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS app_settings (
 setting_key TEXT PRIMARY KEY,
 setting_value TEXT NOT NULL,
 is_public INTEGER NOT NULL DEFAULT 0 CHECK(is_public IN (0,1)),
 updated_by TEXT,
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id TEXT PRIMARY KEY,
 actor_user_id TEXT,
 action TEXT NOT NULL CHECK(length(action) BETWEEN 1 AND 120),
 entity_type TEXT NOT NULL CHECK(length(entity_type) BETWEEN 1 AND 80),
 entity_id TEXT,
 details_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(details_json)),
 ip_hash TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
