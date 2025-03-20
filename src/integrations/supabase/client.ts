
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'collelink-auth-token',
    storage: localStorage,
    // Set session timeout to 10 days (in seconds)
    detectSessionInUrl: true,
    flowType: 'pkce',
    sessionTimeout: 60 * 60 * 24 * 10, // 10 days
  },
});
