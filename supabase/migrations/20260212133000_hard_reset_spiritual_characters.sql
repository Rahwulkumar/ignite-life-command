-- =============================================
-- HARD RESET & DIAGNOSTIC FIX
-- =============================================

BEGIN;

-- 1. DROP (Ensure clean slate)
DROP TABLE IF EXISTS public.spiritual_characters CASCADE;

-- 2. PRE-NOTIFY (Clear cache of old reference)
NOTIFY pgrst, 'reload schema';

-- 3. CREATE (Correct Schema with user_id)
CREATE TABLE public.spiritual_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    role TEXT,
    testament TEXT,
    cover_image TEXT,
    notion_folder_id UUID REFERENCES public.office_notes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
    
    -- Scoped Unique Constraint
    CONSTRAINT spiritual_characters_name_user_key UNIQUE (user_id, name)
);

-- 4. PERMISSIONS (CRITICAL: Ensure API roles can see the table)
-- Often new tables are hidden if default privileges aren't set
GRANT ALL ON public.spiritual_characters TO postgres;
GRANT ALL ON public.spiritual_characters TO anon;
GRANT ALL ON public.spiritual_characters TO authenticated;
GRANT ALL ON public.spiritual_characters TO service_role;

-- 5. RLS
ALTER TABLE public.spiritual_characters ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own characters"
ON public.spiritual_characters FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
ON public.spiritual_characters FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
ON public.spiritual_characters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
ON public.spiritual_characters FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. POST-NOTIFY (Force API to pick up new table & permissions)
NOTIFY pgrst, 'reload schema';

COMMIT;
