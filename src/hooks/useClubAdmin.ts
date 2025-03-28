
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
        // First create the club
        const { data: club, error: clubError } = await supabase
          .from('clubs')
          .insert(clubData)
          .select()
          .single();

        if (clubError) {
          throw clubError;
        }

        // Then add the creator as an admin
        const { error: adminError } = await supabase
          .from('club_admins')
          .insert({
            club_id: club.id,
            user_id: profile.id,
          });

        if (adminError) {
          // If admin creation fails, we need to delete the club
          await supabase.from('clubs').delete().eq('id', club.id);
          throw adminError;
        }

        // Also add the creator as a member
        const { error: memberError } = await supabase
          .from('club_members')
          .insert({
            club_id: club.id,
            user_id: profile.id,
          });

        if (memberError) {
          console.error('Error adding creator as member:', memberError);
          // Not critical, don't throw error
        }

        return club as Club;
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
