
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useClubAdmin } from '../club/useClubAdmin';

/**
 * Utility functions for checking event host permissions
 */
export const useEventPermissions = () => {
  const { profile } = useAuthStore();
  const { isClubAdmin } = useClubAdmin();

  /**
   * Check if user can host event for a given host type and id
   */
  const canHostEvent = async (hostType: 'club' | 'community', hostId: string) => {
    if (!profile?.id) return false;

    try {
      if (hostType === 'club') {
        // For clubs, check if user is an admin
        return await isClubAdmin(hostId);
      } else if (hostType === 'community') {
        // For communities, check if user is a member
        const { data, error } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', hostId)
          .eq('member_id', profile.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking community membership:', error);
          return false;
        }

        return !!data;
      }
    } catch (err) {
      console.error('Error checking host permissions:', err);
      return false;
    }

    return false;
  };

  return {
    canHostEvent,
  };
};
