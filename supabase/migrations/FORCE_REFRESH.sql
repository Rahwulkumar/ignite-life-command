-- Method 1: The standard notify channel
NOTIFY pgrst, 'reload schema';

-- Method 2: A DDL change that forces a schema update event (sometimes more reliable)
COMMENT ON TABLE public.bible_characters IS 'Bible Characters v3 (Cache Refreshed)';
