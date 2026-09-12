BEGIN;

ALTER TABLE publications DROP COLUMN IF EXISTS month;
ALTER TABLE publications DROP COLUMN IF EXISTS academic_session;

ALTER TABLE patents DROP COLUMN IF EXISTS month;
ALTER TABLE patents DROP COLUMN IF EXISTS academic_session;
ALTER TABLE patents DROP COLUMN IF EXISTS place;

ALTER TABLE projects DROP COLUMN IF EXISTS month;
ALTER TABLE projects DROP COLUMN IF EXISTS academic_session;
ALTER TABLE projects DROP COLUMN IF EXISTS duration;
ALTER TABLE projects DROP COLUMN IF EXISTS principal_investigator;
ALTER TABLE projects DROP COLUMN IF EXISTS co_principal_investigator;

ALTER TABLE consultancies DROP COLUMN IF EXISTS month;
ALTER TABLE consultancies DROP COLUMN IF EXISTS academic_session;

ALTER TABLE events DROP COLUMN IF EXISTS academic_session;
ALTER TABLE events DROP COLUMN IF EXISTS convenor;
ALTER TABLE events DROP COLUMN IF EXISTS coordinator;

COMMIT;
