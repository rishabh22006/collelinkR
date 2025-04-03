
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for checking community permissions
 */
export const useCommunityPermissions = () => {
  const { profile } = useAuthStore();

  // Check if user is a community admin
  const isCommunityAdmin = async (communityId: string) => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('member_id', profile.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('Error checking community admin status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to check community admin status:', err);
      return false;
    }
  };

  // Check if user is the community creator
  const isCommunityCreator = async (communityId: string) => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('creator_id')
        .eq('id', communityId)
        .single();

      if (error) {
        console.error('Error checking community creator status:', error);
        return false;
      }

      return data.creator_id === profile.id;
    } catch (err) {
      console.error('Failed to check community creator status:', err);
      return false;
    }
  };

  return {
    isCommunityAdmin,
    isCommunityCreator,
  };
};
