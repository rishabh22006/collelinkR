import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { AdminManagementResult } from './useClubTypes';

/**
 * Hook for community administration functionality
 */
export const useCommunityAdmin = () => {
  const queryClient = useQueryClient();
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

  // Create a new community
  const createCommunity = useMutation({
    mutationFn: async (communityData: {
      name: string;
      description?: string;
      logo_url?: string;
      banner_url?: string;
      is_private?: boolean;
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to create a community');
      }

      try {
        const { data, error } = await supabase
          .from('communities')
          .insert({
            name: communityData.name,
            description: communityData.description || null,
            logo_url: communityData.logo_url || null,
            banner_url: communityData.banner_url || null,
            creator_id: profile.id,
            is_private: communityData.is_private || false
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Also add the creator as an admin member
        const { error: memberError } = await supabase
          .from('community_members')
          .insert({
            community_id: data.id,
            member_id: profile.id,
            role: 'admin'
          });

        if (memberError) {
          throw memberError;
        }

        return data;
      } catch (err) {
        console.error('Failed to create community:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Community created successfully');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create community', {
        description: error.message,
      });
    },
  });

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

  // Get community members
  const getCommunityMembers = async (communityId: string) => {
    try {
      const { data: members, error: membersError } = await supabase
        .from('community_members')
        .select('member_id, role, joined_at')
        .eq('community_id', communityId);

      if (membersError) {
        console.error('Error fetching community members:', membersError);
        return [];
      }

      // Get profiles for all members
      const memberIds = members.map(m => m.member_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', memberIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Combine data into the expected format
      const memberWithProfiles = members.map(member => {
        const profile = profiles?.find(p => p.id === member.member_id);
        
        return {
          member_id: member.member_id,
          joined_at: member.joined_at,
          role: member.role,
          display_name: profile?.display_name || 'Unknown User',
          avatar_url: profile?.avatar_url
        };
      });

      return memberWithProfiles;
    } catch (err) {
      console.error('Failed to fetch community members:', err);
      return [];
    }
  };

  return {
    isCommunityAdmin,
    isCommunityCreator,
    createCommunity,
    addCommunityAdmin,
    removeCommunityAdmin,
    transferCommunityOwnership,
    getCommunityMembers,
  };
};
