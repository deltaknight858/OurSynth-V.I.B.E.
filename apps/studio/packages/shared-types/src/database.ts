// =====================================================
// OURSYNTH PLATFORM - COMPLETE DATABASE TYPES
// =====================================================
// Auto-generated from your Supabase schema
// This file provides TypeScript types for the entire OurSynth Platform database

// Common Supabase JSON type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Complete OurSynth Platform Database Schema
export interface Database {
  public: {
    Tables: {
      // Authentication & User Management
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website_url: string | null;
          location: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          subscription_status: 'active' | 'cancelled' | 'expired';
          subscription_expires_at: string | null;
          total_storage_used: number;
          max_storage_limit: number;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website_url?: string | null;
          location?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'cancelled' | 'expired';
          subscription_expires_at?: string | null;
          total_storage_used?: number;
          max_storage_limit?: number;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website_url?: string | null;
          location?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'cancelled' | 'expired';
          subscription_expires_at?: string | null;
          total_storage_used?: number;
          max_storage_limit?: number;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Studio App - Projects & Canvas
      projects: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          description: string | null;
          thumbnail_url: string | null;
          is_public: boolean;
          canvas_config: Json;
          project_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          user_id: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_public?: boolean;
          canvas_config?: Json;
          project_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_public?: boolean;
          canvas_config?: Json;
          project_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };

      nodes: {
        Row: {
          id: string;
          project_id: string;
          type: string;
          props: Json;
          x: number;
          y: number;
          width: number;
          height: number;
          z_index: number;
          parent_id: string | null;
          locked: boolean;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: string;
          props: Json;
          x: number;
          y: number;
          width?: number;
          height?: number;
          z_index?: number;
          parent_id?: string | null;
          locked?: boolean;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: string;
          props?: Json;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
          z_index?: number;
          parent_id?: string | null;
          locked?: boolean;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Components Marketplace
      components: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          rating: number;
          rating_count: number;
          thumbnail_url: string | null;
          preview_images: string[] | null;
          category: string | null;
          subcategory: string | null;
          download_url: string | null;
          file_size: number | null;
          downloads_count: number;
          author_id: string | null;
          tags: string[] | null;
          is_featured: boolean;
          is_active: boolean;
          is_premium: boolean;
          component_data: Json | null;
          framework: string;
          version: string;
          license: string;
          demo_url: string | null;
          documentation_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number;
          rating?: number;
          rating_count?: number;
          thumbnail_url?: string | null;
          preview_images?: string[] | null;
          category?: string | null;
          subcategory?: string | null;
          download_url?: string | null;
          file_size?: number | null;
          downloads_count?: number;
          author_id?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_active?: boolean;
          is_premium?: boolean;
          component_data?: Json | null;
          framework?: string;
          version?: string;
          license?: string;
          demo_url?: string | null;
          documentation_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          rating?: number;
          rating_count?: number;
          thumbnail_url?: string | null;
          preview_images?: string[] | null;
          category?: string | null;
          subcategory?: string | null;
          download_url?: string | null;
          file_size?: number | null;
          downloads_count?: number;
          author_id?: string | null;
          tags?: string[] | null;
          is_featured?: boolean;
          is_active?: boolean;
          is_premium?: boolean;
          component_data?: Json | null;
          framework?: string;
          version?: string;
          license?: string;
          demo_url?: string | null;
          documentation_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Pathways App - AI Components
      user_components: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          prompt: string;
          generated_code: string;
          preview_image_url: string | null;
          ai_provider: string | null;
          ai_model: string | null;
          generation_time_ms: number | null;
          token_count: number | null;
          framework: string;
          language: string;
          is_public: boolean;
          is_favorite: boolean;
          usage_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          prompt: string;
          generated_code: string;
          preview_image_url?: string | null;
          ai_provider?: string | null;
          ai_model?: string | null;
          generation_time_ms?: number | null;
          token_count?: number | null;
          framework?: string;
          language?: string;
          is_public?: boolean;
          is_favorite?: boolean;
          usage_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          prompt?: string;
          generated_code?: string;
          preview_image_url?: string | null;
          ai_provider?: string | null;
          ai_model?: string | null;
          generation_time_ms?: number | null;
          token_count?: number | null;
          framework?: string;
          language?: string;
          is_public?: boolean;
          is_favorite?: boolean;
          usage_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Domains App
      domains: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          tld: string;
          registrar: string | null;
          purchase_price: number | null;
          renewal_price: number | null;
          purchased_at: string;
          expires_at: string;
          status: 'active' | 'expired' | 'pending' | 'suspended';
          auto_renew: boolean;
          whois_privacy: boolean;
          nameservers: string[] | null;
          dns_config: Json;
          ssl_enabled: boolean;
          ssl_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          tld: string;
          registrar?: string | null;
          purchase_price?: number | null;
          renewal_price?: number | null;
          purchased_at?: string;
          expires_at: string;
          status?: 'active' | 'expired' | 'pending' | 'suspended';
          auto_renew?: boolean;
          whois_privacy?: boolean;
          nameservers?: string[] | null;
          dns_config?: Json;
          ssl_enabled?: boolean;
          ssl_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          tld?: string;
          registrar?: string | null;
          purchase_price?: number | null;
          renewal_price?: number | null;
          purchased_at?: string;
          expires_at?: string;
          status?: 'active' | 'expired' | 'pending' | 'suspended';
          auto_renew?: boolean;
          whois_privacy?: boolean;
          nameservers?: string[] | null;
          dns_config?: Json;
          ssl_enabled?: boolean;
          ssl_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Deploy App
      deployments: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          domain_id: string | null;
          deployment_name: string;
          deployment_url: string | null;
          deployment_type: 'static' | 'spa' | 'ssr' | 'api' | 'full-stack';
          platform: 'azure' | 'vercel' | 'netlify' | 'aws' | 'gcp';
          environment: 'development' | 'staging' | 'production';
          status: 'pending' | 'building' | 'deployed' | 'failed' | 'cancelled';
          build_id: string | null;
          commit_hash: string | null;
          branch_name: string;
          build_logs: string | null;
          error_logs: string | null;
          build_duration_ms: number | null;
          bundle_size: number | null;
          performance_score: number | null;
          deployment_config: Json;
          environment_variables: Json;
          custom_domain: string | null;
          ssl_certificate_id: string | null;
          cdn_enabled: boolean;
          analytics_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          domain_id?: string | null;
          deployment_name: string;
          deployment_url?: string | null;
          deployment_type?: 'static' | 'spa' | 'ssr' | 'api' | 'full-stack';
          platform?: 'azure' | 'vercel' | 'netlify' | 'aws' | 'gcp';
          environment?: 'development' | 'staging' | 'production';
          status?: 'pending' | 'building' | 'deployed' | 'failed' | 'cancelled';
          build_id?: string | null;
          commit_hash?: string | null;
          branch_name?: string;
          build_logs?: string | null;
          error_logs?: string | null;
          build_duration_ms?: number | null;
          bundle_size?: number | null;
          performance_score?: number | null;
          deployment_config?: Json;
          environment_variables?: Json;
          custom_domain?: string | null;
          ssl_certificate_id?: string | null;
          cdn_enabled?: boolean;
          analytics_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          domain_id?: string | null;
          deployment_name?: string;
          deployment_url?: string | null;
          deployment_type?: 'static' | 'spa' | 'ssr' | 'api' | 'full-stack';
          platform?: 'azure' | 'vercel' | 'netlify' | 'aws' | 'gcp';
          environment?: 'development' | 'staging' | 'production';
          status?: 'pending' | 'building' | 'deployed' | 'failed' | 'cancelled';
          build_id?: string | null;
          commit_hash?: string | null;
          branch_name?: string;
          build_logs?: string | null;
          error_logs?: string | null;
          build_duration_ms?: number | null;
          bundle_size?: number | null;
          performance_score?: number | null;
          deployment_config?: Json;
          environment_variables?: Json;
          custom_domain?: string | null;
          ssl_certificate_id?: string | null;
          cdn_enabled?: boolean;
          analytics_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Billing & Subscriptions
      subscription_plans: {
        Row: {
          id: string;
          plan_key: string;
          plan_name: string;
          description: string | null;
          price_monthly: number;
          price_yearly: number | null;
          max_projects: number | null;
          max_deployments: number | null;
          max_storage_gb: number | null;
          max_domains: number | null;
          ai_generation_credits: number | null;
          priority_support: boolean;
          custom_branding: boolean;
          advanced_analytics: boolean;
          features: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_key: string;
          plan_name: string;
          description?: string | null;
          price_monthly: number;
          price_yearly?: number | null;
          max_projects?: number | null;
          max_deployments?: number | null;
          max_storage_gb?: number | null;
          max_domains?: number | null;
          ai_generation_credits?: number | null;
          priority_support?: boolean;
          custom_branding?: boolean;
          advanced_analytics?: boolean;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_key?: string;
          plan_name?: string;
          description?: string | null;
          price_monthly?: number;
          price_yearly?: number | null;
          max_projects?: number | null;
          max_deployments?: number | null;
          max_storage_gb?: number | null;
          max_domains?: number | null;
          ai_generation_credits?: number | null;
          priority_support?: boolean;
          custom_branding?: boolean;
          advanced_analytics?: boolean;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Additional tables
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          action_url: string | null;
          action_label: string | null;
          is_read: boolean;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          delivery_method: 'in-app' | 'email' | 'push' | 'sms';
          related_entity_type: string | null;
          related_entity_id: string | null;
          scheduled_for: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          delivery_method?: 'in-app' | 'email' | 'push' | 'sms';
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          delivery_method?: 'in-app' | 'email' | 'push' | 'sms';
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
      };
    };

    Views: {
      projects_with_stats: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          description: string | null;
          thumbnail_url: string | null;
          is_public: boolean;
          canvas_config: Json;
          project_metadata: Json;
          created_at: string;
          updated_at: string;
          node_count: number;
          last_node_update: string | null;
          fork_count: number;
        };
      };

      user_dashboard_summary: {
        Row: {
          user_id: string;
          display_name: string | null;
          subscription_tier: string | null;
          total_projects: number;
          total_domains: number;
          total_deployments: number;
          total_ai_components: number;
          active_deployments: number;
          last_project_activity: string | null;
        };
      };

      marketplace_components: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          rating: number;
          category: string | null;
          tags: string[] | null;
          is_featured: boolean;
          framework: string;
          avg_rating: number;
          review_count: number;
          download_count: number;
          author_name: string | null;
        };
      };
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Base database structure that can be extended by specific apps
export interface DatabaseBase {
  public: {
    Tables: Record<string, {
      Row: Record<string, any>
      Insert: Record<string, any>
      Update: Record<string, any>
      Relationships?: Array<{
        foreignKeyName: string
        columns: string[]
        referencedRelation: string
        referencedColumns: string[]
      }>
    }>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes?: Record<string, never>
  }
}

// Common table types that appear across apps
export interface UserComponentsTable {
  Row: {
    id: string
    user_id: string
    title: string
    prompt: string
    generated_code: string
    preview_image_url?: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    title: string
    prompt: string
    generated_code: string
    preview_image_url?: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    title?: string
    prompt?: string
    generated_code?: string
    preview_image_url?: string
    created_at?: string
    updated_at?: string
  }
}

export interface DomainsTable {
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
}

// Type helpers for common operations
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Node = Database['public']['Tables']['nodes']['Row'];
export type Component = Database['public']['Tables']['components']['Row'];
export type UserComponent = Database['public']['Tables']['user_components']['Row'];
export type Domain = Database['public']['Tables']['domains']['Row'];
export type Deployment = Database['public']['Tables']['deployments']['Row'];
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Insert types
export type NewProject = Database['public']['Tables']['projects']['Insert'];
export type NewNode = Database['public']['Tables']['nodes']['Insert'];
export type NewComponent = Database['public']['Tables']['components']['Insert'];
export type NewUserComponent = Database['public']['Tables']['user_components']['Insert'];
export type NewDomain = Database['public']['Tables']['domains']['Insert'];
export type NewDeployment = Database['public']['Tables']['deployments']['Insert'];

// Update types
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type NodeUpdate = Database['public']['Tables']['nodes']['Update'];
export type ComponentUpdate = Database['public']['Tables']['components']['Update'];
export type UserComponentUpdate = Database['public']['Tables']['user_components']['Update'];
export type DomainUpdate = Database['public']['Tables']['domains']['Update'];
export type DeploymentUpdate = Database['public']['Tables']['deployments']['Update'];

// View types
export type ProjectWithStats = Database['public']['Views']['projects_with_stats']['Row'];
export type UserDashboardSummary = Database['public']['Views']['user_dashboard_summary']['Row'];
export type MarketplaceComponent = Database['public']['Views']['marketplace_components']['Row'];