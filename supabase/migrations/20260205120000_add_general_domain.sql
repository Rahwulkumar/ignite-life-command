-- Add 'general' domain to the valid domains constraint
-- This allows custom task journals to be saved to a dedicated general domain

-- Drop the existing constraint
ALTER TABLE office_notes 
DROP CONSTRAINT IF EXISTS valid_domain;

-- Recreate the constraint with 'general' included
ALTER TABLE office_notes 
ADD CONSTRAINT valid_domain 
CHECK (domain IN ('spiritual', 'trading', 'tech', 'finance', 'music', 'projects', 'content', 'general') OR domain IS NULL);
