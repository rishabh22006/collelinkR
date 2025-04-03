
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { ClubMembershipStatus } from './useClubTypes';

/**
 * Hook for community membership functionality
 */
export const useCommunityMembership = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  /**
   * Get user's membership status in a community
   */
  const getCommunityMembershipStatus = async (communityId: string): Promise<ClubMembershipStatus> => {
    if (!profile?.id) {
      return { isMember: false, isAdmin: false, isCreator: false };
    }

    try {
      // Get member status
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('member_id', profile.id)
        .single();

      const isMember = !!memberData;
      const isAdmin = memberData?.role === 'admin';

      // Get creator status
      const { data: community, error: creatorError } = await supabase
        .from('communities')
        .select('creator_id')
        .eq('id', communityId)
        .single();

      const isCreator = community?.creator_id === profile.id;

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error checking member status:', memberError);
      }

      if (creatorError) {
        console.error('Error checking creator status:', creatorError);
      }

      return { isMember, isAdmin, isCreator };
    } catch (err) {
      console.error('Failed to get membership status:', err);
      return { isMember: false, isAdmin: false, isCreator: false };
    }
  };

  /**
   * Join a community
   */
  const joinCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join a community');
      }

      try {
        // Check if already a member
        const { data: existingMember } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('member_id', profile.id)
          .single();

        if (existingMember) {
          throw new Error('You are already a member of this community');
        }

        // Check if this is the creator of the community
        const isCreator = await supabase
          .from('communities')
          .select('creator_id')
          .eq('id', communityId)
          .eq('creator_id', profile.id)
          .single();

        // Insert as admin if creator, otherwise as regular member
        const { error } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            member_id: profile.id,
            role: isCreator ? 'admin' : 'member'
          });

        if (error) throw error;

        return true;
      } catch (err) {
        console.error('Failed to join community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully joined community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-membership'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to join community', {
        description: error.message,
      });
    },
  });

  /**
   * Leave a community
   */
  const leaveCommunity = useMutation({
    mutationFn: async (communityId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to leave a community');
      }

      try {
        // Check if user is the creator
        const { data: community } = await supabase
          .from('communities')
          .select('creator_id')
          .eq('id', communityId)
          .single();

        if (community && community.creator_id === profile.id) {
          throw new Error('As the community creator, you cannot leave. Transfer ownership first.');
        }

        // Leave the community
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('member_id', profile.id);

        if (error) throw error;

        return true;
      } catch (err) {
        console.error('Failed to leave community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully left community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-membership'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to leave community', {
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
