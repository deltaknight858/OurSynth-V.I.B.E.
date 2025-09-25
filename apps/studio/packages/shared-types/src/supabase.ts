// =====================================================
// OURSYNTH PLATFORM - SHARED SUPABASE CLIENT
// =====================================================
// Shared Supabase configuration for all OurSynth Platform apps

import { createClient } from '@supabase/supabase-js';
import { Database } from './database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
    });
  },

  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    return supabase.auth.getUser();
  },

  getSession: async () => {
    return supabase.auth.getSession();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions by app
export const db = {
  // Studio App - Projects & Canvas
  projects: {
    getAll: (userId: string) => 
      supabase.from('projects').select('*').eq('user_id', userId),
    
    getById: (id: string) => 
      supabase.from('projects').select('*').eq('id', id).single(),
    
    create: (project: Database['public']['Tables']['projects']['Insert']) => 
      supabase.from('projects').insert(project).select().single(),
    
    update: (id: string, updates: Database['public']['Tables']['projects']['Update']) => 
      supabase.from('projects').update(updates).eq('id', id).select().single(),
    
    delete: (id: string) => 
      supabase.from('projects').delete().eq('id', id),
  },

  nodes: {
    getByProject: (projectId: string) => 
      supabase.from('nodes').select('*').eq('project_id', projectId),
    
    create: (node: Database['public']['Tables']['nodes']['Insert']) => 
      supabase.from('nodes').insert(node).select().single(),
    
    update: (id: string, updates: Database['public']['Tables']['nodes']['Update']) => 
      supabase.from('nodes').update(updates).eq('id', id).select().single(),
    
    delete: (id: string) => 
      supabase.from('nodes').delete().eq('id', id),
  },

  // Pathways App - AI Components
  userComponents: {
    getAll: (userId: string) => 
      supabase.from('user_components').select('*').eq('user_id', userId),
    
    create: (component: Database['public']['Tables']['user_components']['Insert']) => 
      supabase.from('user_components').insert(component).select().single(),
    
    update: (id: string, updates: Database['public']['Tables']['user_components']['Update']) => 
      supabase.from('user_components').update(updates).eq('id', id).select().single(),
    
    delete: (id: string) => 
      supabase.from('user_components').delete().eq('id', id),
  },

  // Components Marketplace
  components: {
    getAll: () => 
      supabase.from('components').select('*').eq('is_active', true),
    
    getFeatured: () => 
      supabase.from('components').select('*').eq('is_featured', true).eq('is_active', true),
    
    getByCategory: (category: string) => 
      supabase.from('components').select('*').eq('category', category).eq('is_active', true),
    
    search: (query: string) => 
      supabase.from('components').select('*').textSearch('name', query).eq('is_active', true),
  },

  // Domains App
  domains: {
    getAll: (userId: string) => 
      supabase.from('domains').select('*').eq('user_id', userId),
    
    create: (domain: Database['public']['Tables']['domains']['Insert']) => 
      supabase.from('domains').insert(domain).select().single(),
    
    update: (id: string, updates: Database['public']['Tables']['domains']['Update']) => 
      supabase.from('domains').update(updates).eq('id', id).select().single(),
    
    delete: (id: string) => 
      supabase.from('domains').delete().eq('id', id),
  },

  // Deploy App
  deployments: {
    getAll: (userId: string) => 
      supabase.from('deployments').select('*').eq('user_id', userId),
    
    getByProject: (projectId: string) => 
      supabase.from('deployments').select('*').eq('project_id', projectId),
    
    create: (deployment: Database['public']['Tables']['deployments']['Insert']) => 
      supabase.from('deployments').insert(deployment).select().single(),
    
    update: (id: string, updates: Database['public']['Tables']['deployments']['Update']) => 
      supabase.from('deployments').update(updates).eq('id', id).select().single(),
    
    delete: (id: string) => 
      supabase.from('deployments').delete().eq('id', id),
  },

  // User Management
  userProfiles: {
    get: (userId: string) => 
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
    
    create: (profile: Database['public']['Tables']['user_profiles']['Insert']) => 
      supabase.from('user_profiles').insert(profile).select().single(),
    
    update: (userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) => 
      supabase.from('user_profiles').update(updates).eq('id', userId).select().single(),
  },

  // Notifications
  notifications: {
    getAll: (userId: string) => 
      supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    
    markAsRead: (id: string) => 
      supabase.from('notifications').update({ is_read: true }).eq('id', id),
    
    markAllAsRead: (userId: string) => 
      supabase.from('notifications').update({ is_read: true }).eq('user_id', userId),
  },

  // Analytics & Views
  views: {
    projectsWithStats: (userId: string) => 
      supabase.from('projects_with_stats').select('*').eq('user_id', userId),
    
    userDashboard: (userId: string) => 
      supabase.from('user_dashboard_summary').select('*').eq('user_id', userId).single(),
    
    marketplaceComponents: () => 
      supabase.from('marketplace_components').select('*'),
  },
};

// Real-time subscriptions helper
export const subscribe = {
  toProjects: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${userId}` }, 
        callback
      )
      .subscribe();
  },

  toNodes: (projectId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('nodes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nodes', filter: `project_id=eq.${projectId}` }, 
        callback
      )
      .subscribe();
  },

  toDeployments: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('deployments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deployments', filter: `user_id=eq.${userId}` }, 
        callback
      )
      .subscribe();
  },
};

// Export the raw client for advanced usage
export { supabase as supabaseClient };

// Re-export all types for convenience
export * from './database';
