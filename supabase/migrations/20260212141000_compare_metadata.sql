-- =============================================
-- DEEP DIVE: Table Metadata Comparison
-- =============================================
-- We compare 'spiritual_characters' (Broken) vs 'office_notes' (Working)
-- to see if there is ANY difference in permissions, ownership, or schema.

WITH table_info AS (
    SELECT 
        tablename, 
        tableowner, 
        hasindexes, 
        hasrules, 
        hastriggers, 
        rowsecurity 
    FROM pg_tables 
    WHERE tablename IN ('spiritual_characters', 'office_notes')
),
grant_info AS (
    SELECT 
        table_name, 
        grantee, 
        privilege_type 
    FROM information_schema.role_table_grants 
    WHERE table_name IN ('spiritual_characters', 'office_notes')
),
policy_info AS (
    SELECT 
        tablename, 
        policyname, 
        permissive, 
        roles, 
        cmd 
    FROM pg_policies 
    WHERE tablename IN ('spiritual_characters', 'office_notes')
)
SELECT 
    t.tablename,
    t.tableowner,
    t.rowsecurity AS rls_enabled,
    jsonb_agg(DISTINCT g.grantee || ':' || g.privilege_type) AS grants,
    count(DISTINCT p.policyname) AS policy_count
FROM table_info t
LEFT JOIN grant_info g ON t.tablename = g.table_name
LEFT JOIN policy_info p ON t.tablename = p.tablename
GROUP BY t.tablename, t.tableowner, t.rowsecurity;
