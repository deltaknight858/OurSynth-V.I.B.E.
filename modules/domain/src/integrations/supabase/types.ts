
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
      domains: {
        Row: {
          id: string
          user_id: string
          name: string
          purchased_at: string
          expires_at: string
          status: string
          auto_renew: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          purchased_at?: string
          expires_at: string
          status?: string
          auto_renew?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          purchased_at?: string
          expires_at?: string
          status?: string
          auto_renew?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_domain_preferences: {
        Row: {
          id: string
          user_id: string
          domain_order: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          domain_order: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          domain_order?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_domain_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
