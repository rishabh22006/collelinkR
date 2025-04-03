
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for club admin permission checking
 */
export const useClubAdminPermissions = () => {
  const { profile } = useAuthStore();

  // Check if user is a club admin
  const isClubAdmin = async (clubId: string): Promise<boolean> => {
    if (!profile?.id) return false;

    try {
      // Using direct query instead of RPC
      const { data, error } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .single();

      if (error) {
        console.error('Error checking club admin status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to check club admin status:', err);
      return false;
    }
  };

  // Check if user is the club creator
  const isClubCreator = async (clubId: string): Promise<boolean> => {
    if (!profile?.id) return false;

    try {
      // Using direct query instead of RPC
      const { data, error } = await supabase
        .from('clubs')
        .select('creator_id')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error checking club creator status:', error);
        return false;
      }

      return data.creator_id === profile.id;
    } catch (err) {
      console.error('Failed to check club creator status:', err);
      return false;
    }
  };

  return {
    isClubAdmin,
    isClubCreator
  };
};
