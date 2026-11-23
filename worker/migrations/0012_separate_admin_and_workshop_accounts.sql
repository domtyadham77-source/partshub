-- Canonical account types and an administrator session store independent of users.
-- The legacy role column remains temporarily for compatibility with older records/routes.
ALTER TABLE users
  ADD COLUMN account_type TEXT NOT NULL DEFAULT 'customer'
  CHECK (account_type IN ('customer', 'merchant', 'workshop'));

UPDATE users
SET account_type = CASE
  WHEN role = 'merchant' THEN 'merchant'
  ELSE 'customer'
END;

-- Admin identities are configured through Cloudflare Secrets, never through users.
-- Clear optional creator references before removing any legacy admin user row.
UPDATE notifications
SET created_by = NULL
WHERE created_by IN (SELECT id FROM users WHERE role = 'admin');

DELETE FROM users WHERE role = 'admin';

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_users_account_type_status
  ON users(account_type, status);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry
  ON admin_sessions(expires_at);
