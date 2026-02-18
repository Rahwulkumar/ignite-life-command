-- =============================================
-- RPC Layer for Bible Characters
-- Bypasses PostgREST table cache by using direct function calls
-- =============================================

-- 1. Fetch all characters
CREATE OR REPLACE FUNCTION public.get_bible_characters()
RETURNS SETOF public.bible_characters
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.bible_characters
    WHERE user_id = auth.uid()
    ORDER BY name ASC;
$$;

-- 2. Fetch single character
CREATE OR REPLACE FUNCTION public.get_bible_character_by_id(p_id UUID)
RETURNS SETOF public.bible_characters
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT *
    FROM public.bible_characters
    WHERE id = p_id AND user_id = auth.uid();
$$;

-- 3. Create character
CREATE OR REPLACE FUNCTION public.create_bible_character(
    p_name TEXT,
    p_role TEXT DEFAULT NULL,
    p_testament TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_notion_folder_id UUID DEFAULT NULL
)
RETURNS public.bible_characters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result public.bible_characters;
BEGIN
    INSERT INTO public.bible_characters (
        name,
        role,
        testament,
        description,
        notion_folder_id,
        user_id
    ) VALUES (
        p_name,
        p_role,
        p_testament,
        p_description,
        p_notion_folder_id,
        auth.uid()
    )
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$;

-- 4. Update character link
CREATE OR REPLACE FUNCTION public.link_character_folder(
    p_character_id UUID,
    p_folder_id UUID
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.bible_characters
    SET notion_folder_id = p_folder_id
    WHERE id = p_character_id AND user_id = auth.uid();
$$;

-- Grant access to these functions
GRANT EXECUTE ON FUNCTION public.get_bible_characters() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_bible_character_by_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_bible_character(TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_character_folder(UUID, UUID) TO authenticated;
