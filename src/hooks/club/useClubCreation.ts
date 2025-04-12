
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
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to create a club');
      }

      try {
        console.log('Creating club with data:', { ...clubData, creator_id: profile.id });
        
        // Create the club first with the authenticated user as creator
        const { data: newClub, error: clubError } = await supabase
          .from('clubs')
          .insert({
            name: clubData.name,
            description: clubData.description || null,
            institution: clubData.institution || null,
            creator_id: profile.id
          })
          .select()
          .single();

        if (clubError) {
          console.error('Error creating club:', clubError);
          throw new Error(`Failed to create club: ${clubError.message}`);
        }

        if (!newClub) {
          throw new Error('No data returned from club creation');
        }

        console.log('Club created:', newClub);

        // Make creator an admin
        const { error: adminError } = await supabase
          .from('club_admins')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (adminError) {
          console.error('Error adding creator as admin:', adminError);
          throw new Error(`Failed to add creator as admin: ${adminError.message}`);
        }

        // Also make creator a member
        const { error: memberError } = await supabase
          .from('club_members')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (memberError) {
          console.error('Error adding creator as member:', memberError);
          throw new Error(`Failed to add creator as member: ${memberError.message}`);
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
