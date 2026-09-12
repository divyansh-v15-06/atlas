-- Migration 005 (down): Revert form parity fields
BEGIN;

ALTER TABLE events DROP COLUMN IF EXISTS category;
ALTER TABLE supervisions DROP COLUMN IF EXISTS academic_session;
ALTER TABLE expert_talks DROP COLUMN IF EXISTS end_date;
ALTER TABLE expert_talks DROP COLUMN IF EXISTS academic_session;

COMMIT;
