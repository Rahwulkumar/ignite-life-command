-- Check if PostgREST processes restarted
-- Look for NEW PIDs and recent backend_start times

SELECT 
    pid,
    usename,
    application_name,
    backend_start,
    state,
    query
FROM pg_stat_activity 
WHERE application_name = 'postgrest'
ORDER BY backend_start DESC;
