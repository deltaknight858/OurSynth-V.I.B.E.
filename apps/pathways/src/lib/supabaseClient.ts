// Re-export the shared Supabase client and utilities
export { supabase, auth, db, subscribe } from '@oursynth/shared-types';

// Re-export types for convenience
export type { 
  UserComponent, 
  NewUserComponent, 
  UserComponentUpdate,
  Database 
} from '@oursynth/shared-types';
