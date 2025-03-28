
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { ClubMember, ClubMembershipStatus } from './useClubTypes';

/**
 * Hook for managing club membership
 */
export const useClubMembership = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Check if user is a club member
  const isClubMember = async (clubId: string): Promise<boolean> => {
    if (!profile?.id) return false;

    try {
      // Using RPC function since we don't have direct table access
      const { data, error } = await supabase
        .rpc('is_club_member', { 
          club_uuid: clubId, 
          user_uuid: profile.id 
        });

      if (error) {
        console.error('Error checking club membership:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to check club membership:', err);
      return false;
    }
  };

  // Get membership status (combining member and admin checks for efficiency)
  const getMembershipStatus = async (clubId: string): Promise<ClubMembershipStatus> => {
    if (!profile?.id) return { isMember: false, isAdmin: false };
    
    try {
      // First check membership
      const membershipResult = await isClubMember(clubId);
      
      // Check admin status
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_club_admin', { 
          club_uuid: clubId, 
          user_uuid: profile.id 
        });

      if (adminError) {
        console.error('Error checking club admin status:', adminError);
        return { isMember: membershipResult, isAdmin: false };
      }

      return { 
        isMember: membershipResult, 
        isAdmin: !!isAdmin 
      };
    } catch (err) {
      console.error('Failed to check membership status:', err);
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

        return data as ClubMember;
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
      toast.error('Failed to join club', {
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
      toast.error('Failed to leave club', {
        description: error.message,
      });
    },
  });

  return {
    isClubMember,
    getMembershipStatus,
    joinClub,
    leaveClub,
  };
};
