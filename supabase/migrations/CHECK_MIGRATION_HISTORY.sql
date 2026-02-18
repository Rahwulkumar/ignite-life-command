-- =============================================
-- VERIFY MIGRATION HISTORY
-- =============================================
-- Check which migrations have ACTUALLY been applied to the remote database

SELECT 
    version,
    name,
    executed_at
FROM supabase_migrations.schema_migrations
WHERE name LIKE '%spiritual%'
ORDER BY executed_at DESC;

-- If the above table doesn't exist, try this:
-- SELECT * FROM _prisma_migrations WHERE migration_name LIKE '%spiritual%';
