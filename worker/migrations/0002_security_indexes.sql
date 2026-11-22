CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type,entity_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_settings_public ON app_settings(is_public,setting_key);
