export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bible_reading_plans: {
        Row: {
          completed_chapters: number
          created_at: string
          current_book: string | null
          current_chapter: number | null
          id: string
          name: string
          total_chapters: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_chapters?: number
          created_at?: string
          current_book?: string | null
          current_chapter?: number | null
          id?: string
          name: string
          total_chapters?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed_chapters?: number
          created_at?: string
          current_book?: string | null
          current_chapter?: number | null
          id?: string
          name?: string
          total_chapters?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checklist_entries: {
        Row: {
          created_at: string
          duration_seconds: number | null
          entry_date: string
          id: string
          is_completed: boolean
          notes: string | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          entry_date: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          task_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          entry_date?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_reports: {
        Row: {
          activities: Json | null
          ai_summary: string | null
          created_at: string | null
          domain_breakdown: Json | null
          id: string
          report_date: string
          total_minutes: number | null
          user_id: string
        }
        Insert: {
          activities?: Json | null
          ai_summary?: string | null
          created_at?: string | null
          domain_breakdown?: Json | null
          id?: string
          report_date: string
          total_minutes?: number | null
          user_id?: string
        }
        Update: {
          activities?: Json | null
          ai_summary?: string | null
          created_at?: string | null
          domain_breakdown?: Json | null
          id?: string
          report_date?: string
          total_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      office_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      office_notes: {
        Row: {
          content: Json | null
          cover_image: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_pinned: boolean | null
          is_template: boolean | null
          parent_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          is_template?: boolean | null
          parent_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          content?: Json | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          is_template?: boolean | null
          parent_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_notes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "office_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      office_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          email_reference: string | null
          id: string
          priority: string
          source: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          email_reference?: string | null
          id?: string
          priority?: string
          source?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          email_reference?: string | null
          id?: string
          priority?: string
          source?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scripture_memory: {
        Row: {
          created_at: string
          id: string
          mastery_level: number
          next_review_at: string | null
          reference: string
          times_reviewed: number | null
          user_id: string
          verse_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          mastery_level?: number
          next_review_at?: string | null
          reference: string
          times_reviewed?: number | null
          user_id?: string
          verse_text: string
        }
        Update: {
          created_at?: string
          id?: string
          mastery_level?: number
          next_review_at?: string | null
          reference?: string
          times_reviewed?: number | null
          user_id?: string
          verse_text?: string
        }
        Relationships: []
      }
      sermon_notes: {
        Row: {
          created_at: string
          date: string
          id: string
          key_takeaways: string[] | null
          notes: string | null
          scripture_references: string[] | null
          speaker: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          key_takeaways?: string[] | null
          notes?: string | null
          scripture_references?: string[] | null
          speaker?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          key_takeaways?: string[] | null
          notes?: string | null
          scripture_references?: string[] | null
          speaker?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      spiritual_goals: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          progress: number
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          progress?: number
          target_date?: string | null
          title: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          progress?: number
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      time_sessions: {
        Row: {
          activity: string
          created_at: string | null
          domain: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string | null
          domain: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          user_id?: string
        }
        Update: {
          activity?: string
          created_at?: string | null
          domain?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
