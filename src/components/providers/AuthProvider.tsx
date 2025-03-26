
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Auth Provider component
 * Updated to leverage optimized auth checks
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setSession, checkAuth } = useAuthStore();

  useEffect(() => {
    // Initial auth check - leverages get_auth_user() on the backend
    checkAuth();

    // Listen for auth changes with performance optimization
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Only trigger a full profile fetch when necessary
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
