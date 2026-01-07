-- Create office_notes table with Notion-like structure
CREATE TABLE public.office_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content JSONB DEFAULT '{}',
  parent_id UUID REFERENCES public.office_notes(id) ON DELETE SET NULL,
  icon TEXT DEFAULT '📝',
  cover_image TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create office_tasks table
CREATE TABLE public.office_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  source TEXT DEFAULT 'manual',
  email_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create office_chat_messages table for Eve
CREATE TABLE public.office_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.office_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for office_notes
CREATE POLICY "Allow all access to office_notes" ON public.office_notes FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for office_tasks
CREATE POLICY "Allow all access to office_tasks" ON public.office_tasks FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for office_chat_messages
CREATE POLICY "Allow all access to office_chat_messages" ON public.office_chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_office_notes_updated_at
  BEFORE UPDATE ON public.office_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_office_tasks_updated_at
  BEFORE UPDATE ON public.office_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();