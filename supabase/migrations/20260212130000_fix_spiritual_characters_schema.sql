-- =============================================
-- SCHEMA FIX: Re-create Spiritual Characters Table
-- =============================================

-- 1. Drop the table if it exists (Clean Slate)
-- This handles the error "relation does not exist" if the table was missing,
-- and ensures we start with the correct schema if it was there.
DROP TABLE IF EXISTS public.spiritual_characters CASCADE;

-- 2. Create the table with the CORRECT Schema (User Scoped)
CREATE TABLE public.spiritual_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    role TEXT, -- 'King', 'Prophet', 'Apostle', etc.
    testament TEXT, -- 'Old', 'New'
    cover_image TEXT,
    notion_folder_id UUID REFERENCES public.office_notes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- The Critical New Column for Tenant Isolation
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
    
    -- Scoped Unique Constraint: Name must be unique per user, not globally
    CONSTRAINT spiritual_characters_name_user_key UNIQUE (user_id, name)
);

-- 3. Enable RLS
ALTER TABLE public.spiritual_characters ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Policy: View (Select)
CREATE POLICY "Users can view own characters"
ON public.spiritual_characters FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Insert
CREATE POLICY "Users can insert own characters"
ON public.spiritual_characters FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Update
CREATE POLICY "Users can update own characters"
ON public.spiritual_characters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Delete
CREATE POLICY "Users can delete own characters"
ON public.spiritual_characters FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
