
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
      // Using RPC function to check admin status
      const { data, error } = await supabase
        .rpc('is_community_admin', { 
          community_uuid: communityId, 
          user_uuid: profile.id 
        });

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
        .rpc('is_community_creator', {
          community_uuid: communityId,
          user_uuid: profile.id
        });

      if (error) {
        console.error('Error checking community creator status:', error);
        return false;
      }

      return !!data;
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
    mutationFn: async ({ communityId, userId }: { communityId: string, userId: string }) => {
      try {
        const { data, error } = await supabase
          .rpc('add_community_admin', {
            community_uuid: communityId,
            user_uuid: userId
          });

        if (error) {
          throw new Error(error.message);
        }

        return data as AdminManagementResult;
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
    mutationFn: async ({ communityId, userId }: { communityId: string, userId: string }) => {
      try {
        const { data, error } = await supabase
          .rpc('remove_community_admin', {
            community_uuid: communityId,
            user_uuid: userId
          });

        if (error) {
          throw new Error(error.message);
        }

        return data as AdminManagementResult;
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
        const { data, error } = await supabase
          .rpc('transfer_community_ownership', {
            community_uuid: communityId,
            old_owner_uuid: profile.id,
            new_owner_uuid: newOwnerId
          });

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('Ownership transfer failed. Make sure the user is an admin.');
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
      const { data, error } = await supabase
        .rpc('get_community_members', { community_uuid: communityId });

      if (error) {
        console.error('Error fetching community members:', error);
        return [];
      }

      return data || [];
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
