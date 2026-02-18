-- =============================================
-- FINAL SOLUTION: Fresh Start with bible_characters
-- =============================================

BEGIN;

-- 1. DROP ALL previous failed attempts to clear metadata
DROP TABLE IF EXISTS public.spiritual_characters CASCADE;
DROP TABLE IF EXISTS public.character_library CASCADE;
DROP FUNCTION IF EXISTS public.create_spiritual_character CASCADE;
DROP FUNCTION IF EXISTS public.debug_table_status CASCADE;

-- 2. Create BRAND NEW table with a name that has NO baggage
CREATE TABLE public.bible_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid(),
    name TEXT NOT NULL,
    description TEXT,
    role TEXT,
    testament TEXT,
    notion_folder_id UUID REFERENCES public.office_notes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT bible_characters_unique_name_per_user UNIQUE (user_id, name)
);

-- 3. Enable RLS
ALTER TABLE public.bible_characters ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
CREATE POLICY "Users can view own bible characters"
ON public.bible_characters FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bible characters"
ON public.bible_characters FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bible characters"
ON public.bible_characters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bible characters"
ON public.bible_characters FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. Grant permissions
GRANT ALL ON public.bible_characters TO postgres;
GRANT ALL ON public.bible_characters TO authenticated;
GRANT ALL ON public.bible_characters TO service_role;
GRANT SELECT ON public.bible_characters TO anon;

-- 6. Create updated_at trigger
CREATE TRIGGER update_bible_characters_updated_at
BEFORE UPDATE ON public.bible_characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7. MANUALLY REGISTER MIGRATION
-- This forces Supabase to acknowledge the script in its history
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260213100000', 'bible_characters_v3_clean')
ON CONFLICT (version) DO UPDATE SET name = EXCLUDED.name;

COMMIT;

-- 8. FORCE RELOAD
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
