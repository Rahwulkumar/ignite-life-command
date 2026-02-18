-- Update bible_reading_plans table for chapter/verse tracking
-- This replaces the manual percentage system with automatic calculation

-- Add new columns for chapter/verse tracking
ALTER TABLE bible_reading_plans 
ADD COLUMN IF NOT EXISTS current_chapter INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_verse INTEGER DEFAULT 1;

-- Remove the manual progress column (we'll calculate it automatically)
ALTER TABLE bible_reading_plans 
DROP COLUMN IF EXISTS progress;

-- Update current_book to be NOT NULL with a default
ALTER TABLE bible_reading_plans 
ALTER COLUMN current_book SET DEFAULT 'Genesis',
ALTER COLUMN current_book SET NOT NULL;

-- Ensure existing records have valid data
UPDATE bible_reading_plans 
SET current_chapter = 1 
WHERE current_chapter IS NULL OR current_chapter < 1;

UPDATE bible_reading_plans 
SET current_verse = 1 
WHERE current_verse IS NULL OR current_verse < 1;

UPDATE bible_reading_plans 
SET current_book = 'Genesis' 
WHERE current_book IS NULL OR current_book = '';

-- Add a comment to the table
COMMENT ON TABLE bible_reading_plans IS 'Tracks user Bible reading progress by book, chapter, and verse';
COMMENT ON COLUMN bible_reading_plans.current_book IS 'Name of the book currently being read (e.g., Psalms, Matthew)';
COMMENT ON COLUMN bible_reading_plans.current_chapter IS 'Current chapter number in the book';
COMMENT ON COLUMN bible_reading_plans.current_verse IS 'Current verse number in the chapter';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
