
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { ClubMembershipStatus } from './useClubTypes';

/**
 * Hook for club membership functionality
 */
export const useClubMembership = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Get membership status (is member and is admin)
  const getClubMembershipStatus = async (clubId: string): Promise<ClubMembershipStatus> => {
    if (!profile?.id) {
      return { isMember: false, isAdmin: false, isCreator: false };
    }

    try {
      // Check if user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .single();

      if (memberError && memberError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking club membership:', memberError);
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Error checking club admin status:', adminError);
      }

      // Check if user is the creator
      const { data: clubData, error: creatorError } = await supabase
        .from('clubs')
        .select('creator_id')
        .eq('id', clubId)
        .single();

      if (creatorError) {
        console.error('Error checking club creator status:', creatorError);
      }

      return { 
        isMember: !!memberData, 
        isAdmin: !!adminData,
        isCreator: clubData?.creator_id === profile.id
      };
    } catch (err) {
      console.error('Failed to check club membership status:', err);
      return { isMember: false, isAdmin: false, isCreator: false };
    }
  };

  // Join a club
  const joinClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join a club');
      }

      try {
        // Check if already a member
        const { data: existingMember } = await supabase
          .from('club_members')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', profile.id)
          .single();

        if (existingMember) {
          throw new Error('You are already a member of this club');
        }

        // Join club
        const { data, error } = await supabase
          .from('club_members')
          .insert({
            club_id: clubId,
            user_id: profile.id
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (err) {
        console.error('Failed to join club:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully joined the club');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to join the club', {
        description: error.message,
      });
    },
  });

  // Leave a club
  const leaveClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to leave a club');
      }

      try {
        // Check if user is the creator
        const { data: club } = await supabase
          .from('clubs')
          .select('creator_id')
          .eq('id', clubId)
          .single();

        if (club && club.creator_id === profile.id) {
          throw new Error('As the creator, you cannot leave the club. Transfer ownership first.');
        }

        // Leave club (delete membership)
        const { data, error } = await supabase
          .from('club_members')
          .delete()
          .eq('club_id', clubId)
          .eq('user_id', profile.id)
          .select();

        if (error) {
          throw error;
        }

        // Also remove from admins if they were an admin
        await supabase
          .from('club_admins')
          .delete()
          .eq('club_id', clubId)
          .eq('user_id', profile.id);

        return data;
      } catch (err) {
        console.error('Failed to leave club:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Successfully left the club');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to leave the club', {
        description: error.message,
      });
    },
  });

  return {
    getClubMembershipStatus,
    joinClub,
    leaveClub,
  };
};
