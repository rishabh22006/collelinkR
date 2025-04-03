
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Club, AdminManagementResult } from './useClubTypes';

/**
 * Hook for club administration functionality
 */
export const useClubAdmin = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Check if user is a club admin
  const isClubAdmin = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
      // Using RPC function to check admin status
      const { data, error } = await supabase
        .rpc('is_club_admin', { 
          club_uuid: clubId, 
          user_uuid: profile.id 
        });

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
  const isClubCreator = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase
        .rpc('is_club_creator', {
          club_uuid: clubId,
          user_uuid: profile.id
        });

      if (error) {
        console.error('Error checking club creator status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to check club creator status:', err);
      return false;
    }
  };

  // Create a new club
  const createClub = useMutation({
    mutationFn: async (clubData: {
      name: string;
      description?: string;
      institution?: string;
      logo_url?: string;
      banner_url?: string;
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to create a club');
      }

      try {
        // Use RPC function to create club and manage all related tasks
        const { data, error } = await supabase
          .rpc('create_club', { 
            club_name: clubData.name,
            club_description: clubData.description || null,
            club_institution: clubData.institution || null, 
            club_logo_url: clubData.logo_url || null,
            club_banner_url: clubData.banner_url || null,
            creator_id: profile.id
          });

        if (error) {
          throw error;
        }

        return data as Club;
      } catch (err) {
        console.error('Failed to create club:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Club created successfully');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create club', {
        description: error.message,
      });
    },
  });

  // Add an admin to a club
  const addClubAdmin = useMutation({
    mutationFn: async ({ clubId, userId }: { clubId: string, userId: string }) => {
      try {
        const { data, error } = await supabase
          .rpc('add_club_admin', {
            club_uuid: clubId,
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
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add admin', {
        description: error.message,
      });
    },
  });

  // Remove an admin from a club
  const removeClubAdmin = useMutation({
    mutationFn: async ({ clubId, userId }: { clubId: string, userId: string }) => {
      try {
        const { data, error } = await supabase
          .rpc('remove_club_admin', {
            club_uuid: clubId,
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
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to remove admin', {
        description: error.message,
      });
    },
  });

  // Transfer club ownership
  const transferClubOwnership = useMutation({
    mutationFn: async ({ 
      clubId, 
      newOwnerId 
    }: { 
      clubId: string, 
      newOwnerId: string 
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to transfer ownership');
      }

      try {
        const { data, error } = await supabase
          .rpc('transfer_club_ownership', {
            club_uuid: clubId,
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
      toast.success('Club ownership transferred successfully');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to transfer club ownership', {
        description: error.message,
      });
    },
  });

  // Get club members with admin status
  const getClubMembers = async (clubId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_club_members', { club_uuid: clubId });

      if (error) {
        console.error('Error fetching club members:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Failed to fetch club members:', err);
      return [];
    }
  };

  return {
    isClubAdmin,
    isClubCreator,
    createClub,
    addClubAdmin,
    removeClubAdmin,
    transferClubOwnership,
    getClubMembers,
  };
};
