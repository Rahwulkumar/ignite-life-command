/**
 * Shared utility types — replaces the ones that used to come from
 * @/integrations/supabase/types (which has been removed).
 */

/** JSON-serialisable value (mirrors the old Supabase Json type) */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
