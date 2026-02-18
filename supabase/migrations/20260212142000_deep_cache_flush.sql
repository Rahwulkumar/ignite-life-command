-- =============================================
-- DEEP CACHE FLUSH & FIX
-- =============================================
-- The API is failing to see the new Function (PGRST202) or Table (PGRST205).
-- We will perform multiple "Schema Events" to force it to wake up.

BEGIN;

-- 1. Drop and Recreate the Function (Ensure it exists)
DROP FUNCTION IF EXISTS public.create_spiritual_character;

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
SECURITY DEFINER
AS $$
DECLARE
    new_record public.spiritual_characters;
BEGIN
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
    
    RETURN to_jsonb(new_record);
END;
$$;

-- 2. GRANT Permissions explicitly to the API Role
-- (PostgREST uses 'anon' and 'authenticated' roles)
GRANT EXECUTE ON FUNCTION public.create_spiritual_character TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_spiritual_character TO service_role;
GRANT EXECUTE ON FUNCTION public.create_spiritual_character TO anon;

-- 3. FORCE SCHEMA EVENT: Toggle RLS
-- This is a "loud" change that usually forces PostgREST to rebuild its cache
ALTER TABLE public.spiritual_characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_characters ENABLE ROW LEVEL SECURITY;

-- 4. FORCE SCHEMA EVENT: Comment Change
-- Another "loud" metadata change
COMMENT ON TABLE public.spiritual_characters IS 'Spiritual Characters - Cache Flushed';

-- 5. Standard Notify
NOTIFY pgrst, 'reload schema';

COMMIT;
