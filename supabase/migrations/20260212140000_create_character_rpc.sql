-- =============================================
-- RPC WRAPPER: Create Character via Stored Proc
-- =============================================
-- This bypasses the PostgREST 'Table Cache' by using a Function call instead.
-- If the API sees the function, it can execute the SQL inside (where the table is definitely known).

CREATE OR REPLACE FUNCTION public.create_spiritual_character(
    p_name TEXT,
    p_role TEXT DEFAULT NULL,
    p_testament TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_cover_image TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated permissions to ensure RLS/Visibility don't block it oddly
AS $$
DECLARE
    new_record public.spiritual_characters;
BEGIN
    -- 1. Perform Insert
    INSERT INTO public.spiritual_characters (
        name,
        role,
        testament,
        description,
        cover_image,
        user_id
    ) VALUES (
        p_name,
        p_role,
        p_testament,
        p_description,
        p_cover_image,
        p_user_id
    )
    RETURNING * INTO new_record;

    -- 2. Return the new record as JSON
    RETURN to_jsonb(new_record);
END;
$$;

-- Grant Execute permissions
GRANT EXECUTE ON FUNCTION public.create_spiritual_character TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_spiritual_character TO service_role;

-- Force one last cache reload to pick up this function
NOTIFY pgrst, 'reload schema';
