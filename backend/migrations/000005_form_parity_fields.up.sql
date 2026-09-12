-- Migration 005: Form parity — add fields missing from DB for Events, Supervisions, Expert Talks
BEGIN;

-- 1. Events: add category (Organized/Attended) — matches tempcsebase events form
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'organized';

-- 2. Supervisions: add academic_session — matches tempcsebase research supervision form
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);

-- 3. Expert Talks: add end_date and academic_session — matches tempcsebase expert talk form
ALTER TABLE expert_talks ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE expert_talks ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);

COMMIT;
