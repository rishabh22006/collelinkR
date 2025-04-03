
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for managing community ownership
 */
export const useCommunityOwnership = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Transfer community ownership
  const transferCommunityOwnership = useMutation({
    mutationFn: async ({ 
      communityId, 
      newOwnerId 
    }: { 
      communityId: string, 
      newOwnerId: string 
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to transfer ownership');
      }

      try {
        // Check if the current user is the creator
        const { data: community } = await supabase
          .from('communities')
          .select('creator_id')
          .eq('id', communityId)
          .single();

        if (!community || community.creator_id !== profile.id) {
          throw new Error('Only the creator can transfer ownership');
        }

        // Check if new owner is already an admin
        const { data: isAdmin } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('member_id', newOwnerId)
          .eq('role', 'admin')
          .single();

        if (!isAdmin) {
          throw new Error('New owner must be an admin first');
        }

        // Transfer ownership
        const { error } = await supabase
          .from('communities')
          .update({ creator_id: newOwnerId })
          .eq('id', communityId);

        if (error) {
          throw new Error(error.message);
        }

        return true;
      } catch (err) {
        console.error('Failed to transfer ownership:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Community ownership transferred successfully');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to transfer community ownership', {
        description: error.message,
      });
    },
  });

  return {
    transferCommunityOwnership,
  };
};
