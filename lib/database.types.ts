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
      posts: {
        Row: {
          author: string
          content: string | null
          created_at: string | null
          id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author: string
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_fkey"
            columns: ["author"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
          url?: string | null
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
