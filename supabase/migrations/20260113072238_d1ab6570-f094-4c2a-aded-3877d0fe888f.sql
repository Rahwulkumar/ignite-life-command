-- Time Sessions Table for tracking time spent on activities
CREATE TABLE public.time_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  domain TEXT NOT NULL CHECK (domain IN ('spiritual', 'tech', 'trading', 'finance', 'music', 'office', 'content', 'projects')),
  activity TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily Reports Table for end-of-day summaries
CREATE TABLE public.daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  report_date DATE NOT NULL,
  total_minutes INTEGER DEFAULT 0,
  domain_breakdown JSONB DEFAULT '{}'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, report_date)
);

-- Enable RLS
ALTER TABLE public.time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for time_sessions
CREATE POLICY "Allow all access to time_sessions" ON public.time_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for daily_reports
CREATE POLICY "Allow all access to daily_reports" ON public.daily_reports
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for time_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_sessions;