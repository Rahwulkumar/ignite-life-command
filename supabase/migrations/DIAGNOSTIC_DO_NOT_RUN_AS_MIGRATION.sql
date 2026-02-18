-- =============================================
-- COMPREHENSIVE DEEP DIAGNOSTIC
-- =============================================
-- Do NOT run as a migration. Run EACH section separately in the SQL Editor.
-- Copy-paste the RESULTS for each section.

-- ========== SECTION 1: Table in pg_catalog ==========
-- PostgREST reads from pg_catalog, NOT information_schema
SELECT 
    c.relname AS table_name,
    n.nspname AS schema_name,
    c.relkind AS type, -- 'r' = table
    pg_catalog.pg_get_userbyid(c.relowner) AS owner,
    c.relrowsecurity AS rls_enabled
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'spiritual_characters'
AND n.nspname = 'public';

-- ========== SECTION 2: Columns ==========
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'spiritual_characters'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========== SECTION 3: PostgREST Config ==========
-- Check which schemas PostgREST is configured to expose
SHOW pgrst.db_schemas;

-- ========== SECTION 4: Check if table is in PostgREST's view ==========
-- PostgREST uses this specific query to find tables
SELECT 
    n.nspname AS table_schema,
    c.relname AS table_name,
    d.description
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_catalog.pg_description d ON d.objoid = c.oid AND d.objsubid = 0
WHERE c.relkind IN ('r', 'v', 'm', 'f', 'p')
AND n.nspname = 'public'
AND c.relname LIKE 'spiritual%';

-- ========== SECTION 5: Check for naming conflicts ==========
-- Maybe there's a VIEW or MATERIALIZED VIEW with the same name blocking it
SELECT 
    c.relname,
    CASE c.relkind 
        WHEN 'r' THEN 'table'
        WHEN 'v' THEN 'view'
        WHEN 'm' THEN 'materialized view'
        WHEN 'f' THEN 'foreign table'
    END AS type,
    n.nspname AS schema
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'spiritual_characters';

-- ========== SECTION 6: Check PostgREST schema cache age ==========
-- If this returns nothing, the NOTIFY listener isn't working
SELECT * FROM pg_stat_activity 
WHERE application_name = 'PostgREST' 
OR backend_type = 'client backend';
