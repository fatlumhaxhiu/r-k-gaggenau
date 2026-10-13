-- Additive, repeatable migration: preserves existing leads and legacy name fields.
-- Apply before deploying the updated Prisma client/application.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "full_name" VARCHAR(255);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "object_type" VARCHAR(100);
-- service_requested already stores the selected service; no destructive rename/backfill.
