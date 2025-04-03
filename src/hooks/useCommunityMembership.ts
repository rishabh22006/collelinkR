
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

  // Get membership status
  const getCommunityMembershipStatus = async (communityId: string): Promise<ClubMembershipStatus> => {
    if (!profile?.id) {
      return { isMember: false, isAdmin: false, isCreator: false };
    }

    try {
      // Check if user is a member and their role
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('member_id', profile.id)
        .single();

      if (memberError && memberError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking community membership:', memberError);
      }

      // Check if user is the creator
      const { data: communityData, error: creatorError } = await supabase
        .from('communities')
        .select('creator_id')
        .eq('id', communityId)
        .single();

      if (creatorError) {
        console.error('Error checking community creator status:', creatorError);
      }

      const isMember = !!memberData;
      const isAdmin = memberData?.role === 'admin';
      const isCreator = communityData?.creator_id === profile.id;

      return { 
        isMember,
        isAdmin,
        isCreator
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

        // Join community
        const { data, error } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            member_id: profile.id,
            role: 'member'
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (err) {
        console.error('Failed to join community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully joined the community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
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

      try {
        // Check if user is the creator
        const { data: community } = await supabase
          .from('communities')
          .select('creator_id')
          .eq('id', communityId)
          .single();

        if (community && community.creator_id === profile.id) {
          throw new Error('As the creator, you cannot leave the community. Transfer ownership first.');
        }

        // Leave community (delete membership)
        const { data, error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('member_id', profile.id)
          .select();

        if (error) {
          throw error;
        }

        return data;
      } catch (err) {
        console.error('Failed to leave community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully left the community');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
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
