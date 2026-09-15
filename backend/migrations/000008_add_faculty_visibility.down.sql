DROP INDEX IF EXISTS idx_faculty_is_visible;
ALTER TABLE faculty DROP COLUMN IF EXISTS is_visible;
