-- Add "character" to the valid_note_type constraint
ALTER TABLE office_notes 
DROP CONSTRAINT IF EXISTS valid_note_type;

ALTER TABLE office_notes 
ADD CONSTRAINT valid_note_type 
CHECK (note_type IN ('hub', 'page', 'journal', 'character'));
