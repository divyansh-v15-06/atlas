ALTER TABLE faculty ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;
CREATE INDEX IF NOT EXISTS idx_faculty_is_visible ON faculty(is_visible) WHERE deleted_at IS NULL;

