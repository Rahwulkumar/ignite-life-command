-- Create custom_task_metrics table for user-defined task questions/metrics
-- Migration: add_custom_task_metrics
-- Created: 2026-02-06

-- Create custom_task_metrics table
CREATE TABLE IF NOT EXISTS custom_task_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id text NOT NULL,
  label text NOT NULL,
  field_type text CHECK (field_type IN ('number', 'text', 'rating', 'boolean', 'duration')) NOT NULL,
  unit text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure no duplicate metrics per user per task
  UNIQUE(user_id, task_id, label)
);

-- Create index for efficient queries by user and task
CREATE INDEX IF NOT EXISTS idx_custom_metrics_user_task ON custom_task_metrics(user_id, task_id);

-- Add metrics_data column to daily_checklist_entries
ALTER TABLE daily_checklist_entries 
ADD COLUMN IF NOT EXISTS metrics_data jsonb DEFAULT '{}'::jsonb;

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_checklist_metrics ON daily_checklist_entries USING gin(metrics_data);

-- Enable Row Level Security
ALTER TABLE custom_task_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own metrics" ON custom_task_metrics;

-- Create RLS policy: Users can only access their own metrics
CREATE POLICY "Users can manage own metrics"
  ON custom_task_metrics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_custom_task_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_custom_task_metrics_updated_at_trigger ON custom_task_metrics;

CREATE TRIGGER update_custom_task_metrics_updated_at_trigger
  BEFORE UPDATE ON custom_task_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_custom_task_metrics_updated_at();

-- Add comment for documentation
COMMENT ON TABLE custom_task_metrics IS 'Stores user-defined metrics/questions for specific tasks (e.g., "Weight lifted?" for Gym)';
COMMENT ON COLUMN custom_task_metrics.field_type IS 'Type of input: number, text, rating (1-10), boolean, or duration (HH:MM)';
COMMENT ON COLUMN custom_task_metrics.order_index IS 'Display order of metrics in the UI';
COMMENT ON COLUMN daily_checklist_entries.metrics_data IS 'JSONB object storing metric values as {metric_id: value}';
