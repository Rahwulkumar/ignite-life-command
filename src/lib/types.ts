/** Shared utility types used across the frontend. */

/** JSON-serializable value used for note content and API payloads. */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
