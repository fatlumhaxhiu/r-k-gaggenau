-- Additive only. Run before enabling META_CAPI_ENABLED. Existing CRM tables are untouched.
BEGIN;
CREATE TABLE IF NOT EXISTS tracking_deliveries (
  event_id VARCHAR(64) PRIMARY KEY,
  session_id UUID NOT NULL,
  event_name VARCHAR(32) NOT NULL,
  payload JSONB,
  consent_version INTEGER NOT NULL,
  consent_saved_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  locked_until TIMESTAMPTZ,
  last_error VARCHAR(100),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS tracking_deliveries_status_next_attempt_at_locked_until_idx
  ON tracking_deliveries(status, next_attempt_at, locked_until);
CREATE INDEX IF NOT EXISTS tracking_deliveries_session_id_status_idx
  ON tracking_deliveries(session_id, status);
CREATE TABLE IF NOT EXISTS tracking_rate_limits (
  key VARCHAR(64) PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS tracking_rate_limits_expires_at_idx ON tracking_rate_limits(expires_at);
COMMIT;