
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { AdminManagementResult } from '../useClubTypes';

/**
 * Hook for managing community administrators
 */
export const useCommunityAdminManagement = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Add an admin to a community
  const addCommunityAdmin = useMutation({
    mutationFn: async ({ communityId, userId }: { communityId: string, userId: string }): Promise<AdminManagementResult> => {
      try {
        // Check if requester has permission (is an admin)
        if (!profile?.id) {
          return {
            success: false,
            error: 'not_authenticated',
            message: 'You must be logged in to perform this action'
          };
        }

        const { data: requesterAdmin } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('member_id', profile.id)
          .eq('role', 'admin')
          .single();

        if (!requesterAdmin) {
          return {
            success: false,
            error: 'permission_denied',
            message: 'You do not have permission to add admins'
          };
        }

        // Check if the user is already a member
        const { data: existingMember } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('member_id', userId)
          .single();

        if (!existingMember) {
          // Add as member first with member role
          await supabase
            .from('community_members')
            .insert({
              community_id: communityId,
              member_id: userId,
              role: 'member'
            });
        } else if (existingMember.role === 'admin') {
          return {
            success: false,
            error: 'already_admin',
            message: 'User is already an admin'
          };
        }

        // Count current admins
        const { count } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', communityId)
          .eq('role', 'admin');

        // Get max admins from communities table
        const { data: communityData } = await supabase
          .from('communities')
          .select('max_admins')
          .eq('id', communityId)
          .single();

        // Default to 4 if max_admins is not set or there's an error
        const maxAdmins = (communityData && 'max_admins' in communityData) 
          ? communityData.max_admins 
          : 4;

        if (count && count >= maxAdmins) {
          return {
            success: false,
            error: 'max_admins_reached',
            message: `Maximum number of admins (${maxAdmins}) reached`
          };
        }

        // Update to admin role
        const { error } = await supabase
          .from('community_members')
          .update({ role: 'admin' })
          .eq('community_id', communityId)
          .eq('member_id', userId);

        if (error) {
          throw new Error(error.message);
        }

        return {
          success: true,
          message: 'Admin added successfully'
        };
      } catch (err) {
        console.error('Failed to add admin:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add admin', {
        description: error.message,
      });
    },
  });

  // Remove an admin from a community
  const removeCommunityAdmin = useMutation({
    mutationFn: async ({ communityId, userId }: { communityId: string, userId: string }): Promise<AdminManagementResult> => {
      try {
        // Check if requester has permission (is an admin)
        if (!profile?.id) {
          return {
            success: false,
            error: 'not_authenticated',
            message: 'You must be logged in to perform this action'
          };
        }

        const { data: requesterAdmin } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', communityId)
          .eq('member_id', profile.id)
          .eq('role', 'admin')
          .single();

        if (!requesterAdmin) {
          return {
            success: false,
            error: 'permission_denied',
            message: 'You do not have permission to remove admins'
          };
        }

        // Check if user is the community creator
        const { data: community } = await supabase
          .from('communities')
          .select('creator_id')
          .eq('id', communityId)
          .single();

        if (community && community.creator_id === userId) {
          return {
            success: false,
            error: 'creator_removal',
            message: 'Cannot remove the community creator. Transfer ownership first.'
          };
        }

        // Count current admins
        const { count } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', communityId)
          .eq('role', 'admin');

        // Don't allow removing the last admin
        if (count && count <= 1) {
          return {
            success: false,
            error: 'last_admin',
            message: 'Cannot remove the last admin'
          };
        }

        // Downgrade to regular member
        const { error } = await supabase
          .from('community_members')
          .update({ role: 'member' })
          .eq('community_id', communityId)
          .eq('member_id', userId)
          .eq('role', 'admin');

        if (error) {
          throw new Error(error.message);
        }

        return {
          success: true,
          message: 'Admin removed successfully'
        };
      } catch (err) {
        console.error('Failed to remove admin:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to remove admin', {
        description: error.message,
      });
    },
  });

  return {
    addCommunityAdmin,
    removeCommunityAdmin,
  };
};
