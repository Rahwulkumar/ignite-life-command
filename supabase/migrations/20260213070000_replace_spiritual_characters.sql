-- =============================================
-- FINAL SOLUTION: Fresh Start with character_library
-- =============================================

BEGIN;

-- 1. Drop the cursed spiritual_characters table completely
DROP TABLE IF EXISTS public.spiritual_characters CASCADE;

-- 2. Remove all diagnostic/temporary functions
DROP FUNCTION IF EXISTS public.create_spiritual_character CASCADE;
DROP FUNCTION IF EXISTS public.debug_table_status CASCADE;

-- 3. Create BRAND NEW table with clean name
CREATE TABLE public.character_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid(),
    name TEXT NOT NULL,
    description TEXT,
    role TEXT,
    testament TEXT,
    cover_image TEXT,
    notion_folder_id UUID REFERENCES public.office_notes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT character_library_unique_name_per_user UNIQUE (user_id, name)
);

-- 4. Enable RLS
ALTER TABLE public.character_library ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
CREATE POLICY "Users can view own characters"
ON public.character_library FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
ON public.character_library FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
ON public.character_library FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
ON public.character_library FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. Grant permissions
GRANT ALL ON public.character_library TO postgres;
GRANT ALL ON public.character_library TO authenticated;
GRANT ALL ON public.character_library TO service_role;
GRANT SELECT ON public.character_library TO anon;

-- 7. Create updated_at trigger
CREATE TRIGGER update_character_library_updated_at
BEFORE UPDATE ON public.character_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;

-- 8. Notify PostgREST
NOTIFY pgrst, 'reload schema';
