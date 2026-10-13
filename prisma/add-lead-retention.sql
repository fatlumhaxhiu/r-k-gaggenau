-- Additive migration. Existing records receive no invented closure date.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS closure_reason VARCHAR(500);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS retention_hold_reason VARCHAR(500);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS retention_review_at TIMESTAMPTZ;
