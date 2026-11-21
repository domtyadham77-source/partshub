PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 full_name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 phone TEXT,
 role TEXT NOT NULL CHECK(role IN ('customer','merchant','admin')),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','pending','suspended')),
 password_hash TEXT NOT NULL,
 password_salt TEXT NOT NULL,
 password_iterations INTEGER NOT NULL DEFAULT 310000,
 email_verified_at TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS sessions (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE,
 expires_at TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS password_reset_tokens (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE,
 expires_at TEXT NOT NULL,
 consumed_at TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role,status);
