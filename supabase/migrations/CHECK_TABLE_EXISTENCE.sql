-- DIAGNOSTIC: Check if table exists in valid schemas
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'bible_characters';
