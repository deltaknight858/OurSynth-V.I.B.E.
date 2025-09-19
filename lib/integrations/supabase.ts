// PROMOTED from import-staging/src/supabaseClient.ts on 2025-09-08T20:34:32.057Z
// TODO: Review for token + design lint compliance.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
