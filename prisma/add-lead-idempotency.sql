-- Run before deploying the new POST /api/leads route. Existing leads remain valid.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS request_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS request_hash VARCHAR(64);
CREATE UNIQUE INDEX IF NOT EXISTS leads_request_id_key ON leads(request_id);
