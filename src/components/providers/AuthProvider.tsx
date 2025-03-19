
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setSession, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN') {
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
