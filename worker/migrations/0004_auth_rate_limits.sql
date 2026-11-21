CREATE TABLE IF NOT EXISTS auth_attempts (
 id TEXT PRIMARY KEY,
 key_hash TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_key_created ON auth_attempts(key_hash,created_at);
