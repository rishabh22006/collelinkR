
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Club } from './clubTypes';

/**
 * Hook for club creation functionality
 */
export const useClubCreation = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

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
        // Create the club first
        const { data: newClub, error: clubError } = await supabase
          .from('clubs')
          .insert({
            name: clubData.name,
            description: clubData.description || null,
            institution: clubData.institution || null,
            logo_url: clubData.logo_url || null,
            banner_url: clubData.banner_url || null,
            creator_id: profile.id
          })
          .select()
          .single();

        if (clubError) {
          throw clubError;
        }

        // Make creator an admin
        const { error: adminError } = await supabase
          .from('club_admins')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (adminError) {
          throw adminError;
        }

        // Also make creator a member
        const { error: memberError } = await supabase
          .from('club_members')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (memberError) {
          throw memberError;
        }

        return newClub as Club;
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

  return { createClub };
};
