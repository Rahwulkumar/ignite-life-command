-- Add domain and note_type columns to office_notes
ALTER TABLE office_notes 
ADD COLUMN domain text,
ADD COLUMN note_type text DEFAULT 'page';

-- Add check constraint for valid domains
ALTER TABLE office_notes 
ADD CONSTRAINT valid_domain 
CHECK (domain IN ('spiritual', 'trading', 'tech', 'finance', 'music', 'projects', 'content') OR domain IS NULL);

-- Add check constraint for valid note types
ALTER TABLE office_notes 
ADD CONSTRAINT valid_note_type 
CHECK (note_type IN ('hub', 'page', 'journal'));

-- Create index for efficient domain queries
CREATE INDEX idx_office_notes_domain ON office_notes(domain);
CREATE INDEX idx_office_notes_note_type ON office_notes(note_type);