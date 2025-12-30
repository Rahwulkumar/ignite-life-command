-- Bible Reading Plans
CREATE TABLE public.bible_reading_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  total_chapters INTEGER NOT NULL DEFAULT 1189,
  completed_chapters INTEGER NOT NULL DEFAULT 0,
  current_book TEXT DEFAULT 'Genesis',
  current_chapter INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scripture Memory Cards
CREATE TABLE public.scripture_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  mastery_level INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  times_reviewed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Church/Sermon Notes
CREATE TABLE public.sermon_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  speaker TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  key_takeaways TEXT[],
  scripture_references TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Spiritual Goals
CREATE TABLE public.spiritual_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Chat History for Spiritual Guide
CREATE TABLE public.spiritual_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.bible_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for now (no auth required for demo)
CREATE POLICY "Allow all access to bible_reading_plans" ON public.bible_reading_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to scripture_memory" ON public.scripture_memory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sermon_notes" ON public.sermon_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to spiritual_goals" ON public.spiritual_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to spiritual_chat_messages" ON public.spiritual_chat_messages FOR ALL USING (true) WITH CHECK (true);