
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Hardcoding the Supabase URL and anon key for now
// In a production environment, these would typically come from environment variables
const supabaseUrl = "https://gsiahmdrzkuujzbzvfsi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWFobWRyemt1dWp6Ynp2ZnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjc4MzYsImV4cCI6MjA1Nzk0MzgzNn0.-Gw6hInuc5GaA4ItQH12QA0yiUEr5lRkIHXMR0J6DDQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'collelink-auth-token',
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
