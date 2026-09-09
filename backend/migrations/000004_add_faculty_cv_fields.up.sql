-- Migration 000004: Add faculty CV fields aligned with tempcsebase
BEGIN;

-- 1. Publications: add month, academic_session
ALTER TABLE publications ADD COLUMN IF NOT EXISTS month INT;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);

-- 2. Patents: add month, academic_session, place
ALTER TABLE patents ADD COLUMN IF NOT EXISTS month INT;
ALTER TABLE patents ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);
ALTER TABLE patents ADD COLUMN IF NOT EXISTS place VARCHAR(255);

-- 3. Projects: add month, academic_session, duration, principal_investigator, co_principal_investigator
ALTER TABLE projects ADD COLUMN IF NOT EXISTS month INT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS principal_investigator VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS co_principal_investigator VARCHAR(255);

-- 4. Consultancies: add month, academic_session
ALTER TABLE consultancies ADD COLUMN IF NOT EXISTS month INT;
ALTER TABLE consultancies ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);

-- 5. Events: add academic_session, convenor, coordinator
ALTER TABLE events ADD COLUMN IF NOT EXISTS academic_session VARCHAR(20);
ALTER TABLE events ADD COLUMN IF NOT EXISTS convenor VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS coordinator VARCHAR(255);

COMMIT;
