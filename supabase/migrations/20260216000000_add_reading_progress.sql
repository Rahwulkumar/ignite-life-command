-- Add progress field to bible_reading_plans for percentage tracking
ALTER TABLE bible_reading_plans 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

-- Update existing plans to have 0 progress
UPDATE bible_reading_plans 
SET progress = 0 
WHERE progress IS NULL;
