-- Create table for tracking daily checklist entries
CREATE TABLE public.daily_checklist_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  task_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  duration_seconds INTEGER DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one entry per task per day per user
  CONSTRAINT daily_checklist_entries_unique_task_date UNIQUE (user_id, task_id, entry_date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_checklist_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own checklist entries"
ON public.daily_checklist_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist entries"
ON public.daily_checklist_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist entries"
ON public.daily_checklist_entries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist entries"
ON public.daily_checklist_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_checklist_entries_updated_at
BEFORE UPDATE ON public.daily_checklist_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();