-- CHECK POSTGREST STATS
SELECT 
    pid, 
    backend_start, 
    state, 
    query, 
    application_name 
FROM pg_stat_activity 
WHERE application_name ILIKE '%post%' 
OR query ILIKE '%character%';
