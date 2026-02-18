-- Force PostgREST to reload the schema cache
-- This is necessary after DDL changes (DROP/CREATE TABLE) to ensure the API knows about the new table.

NOTIFY pgrst, 'reload schema';

-- Verification: Check if table exists (for log output)
SELECT exists (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'spiritual_characters'
);
