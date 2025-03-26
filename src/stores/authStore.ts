
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

type Profile = {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  institution: string | null;
  bio: string | null;
  role: 'admin' | 'moderator' | 'user';
  joined_at?: string; // Added joined_at field as optional
};

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      profile: null,
      isLoading: true,
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      checkAuth: async () => {
        try {
          set({ isLoading: true });

          // Get session
          const { data: { session } } = await supabase.auth.getSession();
          set({ session });

          if (session?.user) {
            // Get profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id as any)
              .single();

            if (error) {
              console.error('Error fetching profile:', error);
            } else {
              set({ profile: profile as unknown as Profile });
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({ session: null, profile: null });
        } catch (error) {
          console.error('Sign out error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session }),
    }
  )
);
