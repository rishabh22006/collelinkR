
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook for authentication state management
 */
export const useAuth = () => {
  const { session, profile, isLoading, checkAuth, signOut } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the component mounts
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN') {
          checkAuth();
        } else if (event === 'SIGNED_OUT') {
          // Make sure local state is cleared on sign out
          signOut();
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, signOut]);

  return {
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    isAdmin: profile?.role === 'admin',
    isModerator: profile?.role === 'moderator',
    signOut,
    // Add university related helpers
    university: profile?.university || '',
    college: profile?.college || '',
    hasUniversityInfo: !!(profile?.university && profile?.college)
  };
};

export default useAuth;
