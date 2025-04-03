
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for community membership functionality
 */
export const useCommunityMembership = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Get membership status (is member and is admin)
  const getCommunityMembershipStatus = async (communityId: string) => {
    if (!profile?.id) {
      return { isMember: false, isAdmin: false, isCreator: false };
    }

    try {
      // Check if user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('member_id', profile.id)
        .single();

      if (memberError && memberError.code !== 'PGRST116') { // Not found error
        console.error('Error checking community membership:', memberError);
        return { isMember: false, isAdmin: false, isCreator: false };
      }

      const isMember = !!memberData;
      const isAdmin = memberData?.role === 'admin';

      // Check if user is the creator
      const { data: isCreator, error: creatorError } = await supabase
        .rpc('is_community_creator', { 
          community_uuid: communityId, 
          user_uuid: profile.id 
        });

      if (creatorError) {
        console.error('Error checking community creator status:', creatorError);
        return { isMember, isAdmin, isCreator: false };
      }

      return { 
        isMember, 
        isAdmin,
        isCreator: !!isCreator
      };
    } catch (err) {
      console.error('Failed to check community membership status:', err);
      return { isMember: false, isAdmin: false, isCreator: false };
    }
  };

  // Join a community
  const joinCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join a community');
      }

      try {
        const { data, error } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            member_id: profile.id,
            role: 'member'
          })
          .select();

        if (error) {
          throw error;
        }

        return data[0];
      } catch (err) {
        console.error('Failed to join community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully joined the community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to join the community', {
        description: error.message,
      });
    },
  });

  // Leave a community
  const leaveCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to leave a community');
      }

      // Check if user is the creator
      const { data: isCreator, error: creatorError } = await supabase
        .rpc('is_community_creator', { 
          community_uuid: communityId, 
          user_uuid: profile.id 
        });

      if (creatorError) {
        throw creatorError;
      }

      if (isCreator) {
        throw new Error('You cannot leave a community you created. Transfer ownership first.');
      }

      try {
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('member_id', profile.id);

        if (error) {
          throw error;
        }

        return true;
      } catch (err) {
        console.error('Failed to leave community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully left the community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to leave the community', {
        description: error.message,
      });
    },
  });

  return {
    getCommunityMembershipStatus,
    joinCommunity,
    leaveCommunity,
  };
};
