-- =============================================
-- IDENTIFY WHICH DATABASE YOU'RE CONNECTED TO
-- =============================================
-- Run this in the Supabase SQL Editor

SELECT 
    current_database() as database_name,
    inet_server_addr() as server_ip,
    inet_server_port() as server_port,
    version() as postgres_version,
    current_setting('listen_addresses') as listen_addresses;

-- Also check the project reference
SELECT 
    pg_database.datname,
    pg_tablespace.spcname as tablespace
FROM pg_database
JOIN pg_tablespace ON pg_database.dattablespace = pg_tablespace.oid
WHERE pg_database.datname = current_database();
