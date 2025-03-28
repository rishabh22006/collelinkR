
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Club } from './useClubTypes';

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

  return {
    isClubAdmin,
    createClub,
  };
};
