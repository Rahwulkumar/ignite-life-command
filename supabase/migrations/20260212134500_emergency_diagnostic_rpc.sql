-- =============================================
-- DIAGNOSTIC RPC: Bypass API Cache to check DB
-- =============================================

CREATE OR REPLACE FUNCTION public.debug_table_status()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as Postgres/Admin, bypassing RLS to see the truth
AS $$
DECLARE
    table_exists BOOLEAN;
    rls_enabled BOOLEAN;
    details JSONB;
BEGIN
    -- 1. Check if table physically exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'spiritual_characters'
    ) INTO table_exists;

    -- 2. Check RLS status
    SELECT relrowsecurity 
    INTO rls_enabled
    FROM pg_class
    WHERE oid = 'public.spiritual_characters'::regclass;

    -- 3. Construct result
    details := jsonb_build_object(
        'table_exists', table_exists,
        'rls_enabled', rls_enabled,
        'server_time', now(),
        'columns', (
            SELECT jsonb_agg(column_name)
            FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = 'spiritual_characters'
        )
    );

    RETURN details;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Grant access to everyone
GRANT EXECUTE ON FUNCTION public.debug_table_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.debug_table_status() TO anon;

-- Force cache reload again, just in case
NOTIFY pgrst, 'reload schema';
