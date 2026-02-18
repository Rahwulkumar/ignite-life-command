export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            bible_reading_plans: {
                Row: {
                    id: string
                    user_id: string
                    current_book: string
                    current_chapter: number
                    current_verse: number
                    completed_chapters: number
                    total_chapters: number
                    created_at: string
                    updated_at: string
                    name: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    current_book?: string
                    current_chapter?: number
                    current_verse?: number
                    completed_chapters?: number
                    total_chapters?: number
                    created_at?: string
                    updated_at?: string
                    name: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    current_book?: string
                    current_chapter?: number
                    current_verse?: number
                    completed_chapters?: number
                    total_chapters?: number
                    created_at?: string
                    updated_at?: string
                    name?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "bible_reading_plans_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            daily_focus: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    reference: string
                    content: string
                    completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date?: string
                    reference: string
                    content: string
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    reference?: string
                    content?: string
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_focus_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            spiritual_characters: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    role: string | null
                    testament: string | null
                    cover_image: string | null
                    notion_folder_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    role?: string | null
                    testament?: string | null
                    cover_image?: string | null
                    notion_folder_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    role?: string | null
                    testament?: string | null
                    cover_image?: string | null
                    notion_folder_id?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            scripture_verses: {
                Row: {
                    id: string
                    user_id: string
                    reference: string
                    verse_text: string
                    mastery_level: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    reference: string
                    verse_text: string
                    mastery_level?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    reference?: string
                    verse_text?: string
                    mastery_level?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            spiritual_journal_entries: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: string | Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    content: string | Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: string | Json
                    created_at?: string
                    updated_at?: string
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
