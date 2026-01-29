-- =============================================
-- SECURITY FIX: Clean orphaned data, then fix RLS
-- =============================================

-- First, delete all existing data with null user_ids (orphaned data that can't be associated with users)
DELETE FROM public.scripture_memory WHERE user_id IS NULL;
DELETE FROM public.office_tasks WHERE user_id IS NULL;
DELETE FROM public.time_sessions WHERE user_id IS NULL;
DELETE FROM public.office_notes WHERE user_id IS NULL;
DELETE FROM public.bible_reading_plans WHERE user_id IS NULL;
DELETE FROM public.spiritual_goals WHERE user_id IS NULL;
DELETE FROM public.daily_reports WHERE user_id IS NULL;
DELETE FROM public.sermon_notes WHERE user_id IS NULL;
DELETE FROM public.spiritual_chat_messages WHERE user_id IS NULL;
DELETE FROM public.office_chat_messages WHERE user_id IS NULL;

-- Fix the update_updated_at_column function to have fixed search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Now make user_id NOT NULL with default for all tables

-- 1. scripture_memory
ALTER TABLE public.scripture_memory 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to scripture_memory" ON public.scripture_memory;

CREATE POLICY "Users can view own scripture memory"
ON public.scripture_memory FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripture memory"
ON public.scripture_memory FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripture memory"
ON public.scripture_memory FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripture memory"
ON public.scripture_memory FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. office_tasks
ALTER TABLE public.office_tasks 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to office_tasks" ON public.office_tasks;

CREATE POLICY "Users can view own tasks"
ON public.office_tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON public.office_tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON public.office_tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON public.office_tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. time_sessions
ALTER TABLE public.time_sessions 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to time_sessions" ON public.time_sessions;

CREATE POLICY "Users can view own time sessions"
ON public.time_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time sessions"
ON public.time_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time sessions"
ON public.time_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own time sessions"
ON public.time_sessions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. office_notes
ALTER TABLE public.office_notes 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to office_notes" ON public.office_notes;

CREATE POLICY "Users can view own notes"
ON public.office_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
ON public.office_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
ON public.office_notes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON public.office_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. bible_reading_plans
ALTER TABLE public.bible_reading_plans 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to bible_reading_plans" ON public.bible_reading_plans;

CREATE POLICY "Users can view own reading plans"
ON public.bible_reading_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading plans"
ON public.bible_reading_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading plans"
ON public.bible_reading_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading plans"
ON public.bible_reading_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. spiritual_goals
ALTER TABLE public.spiritual_goals 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to spiritual_goals" ON public.spiritual_goals;

CREATE POLICY "Users can view own spiritual goals"
ON public.spiritual_goals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spiritual goals"
ON public.spiritual_goals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spiritual goals"
ON public.spiritual_goals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spiritual goals"
ON public.spiritual_goals FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. daily_reports
ALTER TABLE public.daily_reports 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to daily_reports" ON public.daily_reports;

CREATE POLICY "Users can view own daily reports"
ON public.daily_reports FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily reports"
ON public.daily_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily reports"
ON public.daily_reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily reports"
ON public.daily_reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 8. sermon_notes
ALTER TABLE public.sermon_notes 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to sermon_notes" ON public.sermon_notes;

CREATE POLICY "Users can view own sermon notes"
ON public.sermon_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sermon notes"
ON public.sermon_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sermon notes"
ON public.sermon_notes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sermon notes"
ON public.sermon_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 9. spiritual_chat_messages
ALTER TABLE public.spiritual_chat_messages 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to spiritual_chat_messages" ON public.spiritual_chat_messages;

CREATE POLICY "Users can view own spiritual chat messages"
ON public.spiritual_chat_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spiritual chat messages"
ON public.spiritual_chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spiritual chat messages"
ON public.spiritual_chat_messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spiritual chat messages"
ON public.spiritual_chat_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 10. office_chat_messages
ALTER TABLE public.office_chat_messages 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS "Allow all access to office_chat_messages" ON public.office_chat_messages;

CREATE POLICY "Users can view own office chat messages"
ON public.office_chat_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own office chat messages"
ON public.office_chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own office chat messages"
ON public.office_chat_messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own office chat messages"
ON public.office_chat_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);