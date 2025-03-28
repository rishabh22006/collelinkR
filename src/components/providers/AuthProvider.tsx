
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Auth Provider component
 * Manages authentication state across the application
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setSession, checkAuth } = useAuthStore();

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Update session state
        setSession(session);
        
        // If signed in or token refreshed, fetch full profile data
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, setSession]);

  return <>{children}</>;
};

export default AuthProvider;
