
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
      return { isMember: false, isAdmin: false };
    }

    try {
      // Check if user is a member
      const { data: isMember, error: memberError } = await supabase
        .rpc('is_club_member', { 
          club_uuid: clubId, 
          user_uuid: profile.id 
        });

      if (memberError) {
        console.error('Error checking club membership:', memberError);
        return { isMember: false, isAdmin: false };
      }

      // Check if user is an admin
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_club_admin', { 
          club_uuid: clubId, 
          user_uuid: profile.id 
        });

      if (adminError) {
        console.error('Error checking club admin status:', adminError);
        return { isMember: !!isMember, isAdmin: false };
      }

      return { 
        isMember: !!isMember, 
        isAdmin: !!isAdmin 
      };
    } catch (err) {
      console.error('Failed to check club membership status:', err);
      return { isMember: false, isAdmin: false };
    }
  };

  // Join a club
  const joinClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join a club');
      }

      try {
        const { data, error } = await supabase
          .rpc('join_club', { 
            club_uuid: clubId, 
            user_uuid: profile.id 
          });

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
        const { data, error } = await supabase
          .rpc('leave_club', { 
            club_uuid: clubId, 
            user_uuid: profile.id 
          });

        if (error) {
          throw error;
        }

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
