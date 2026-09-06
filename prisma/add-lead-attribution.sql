-- Run once against the target PostgreSQL database before deploying this code.
-- Nullable columns preserve all existing leads.
ALTER TABLE "leads"
  ADD COLUMN IF NOT EXISTS "city" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "marketing_channel" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "campaign_name" VARCHAR(255);
