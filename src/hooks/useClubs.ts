
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Club, ClubMember, ClubAdmin } from '@/types/supabase';

export { Club, ClubMember, ClubAdmin } from '@/types/supabase';

export const useClubs = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Get all clubs
  const {
    data: clubs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching clubs:', error);
          throw error;
        }

        return data as Club[];
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
        return [];
      }
    },
  });

  // Get featured clubs
  const {
    data: featuredClubs = [],
    isLoading: isFeaturedLoading,
  } = useQuery({
    queryKey: ['clubs', 'featured'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('is_featured', true)
          .order('name');

        if (error) {
          console.error('Error fetching featured clubs:', error);
          throw error;
        }

        return data as Club[];
      } catch (err) {
        console.error('Failed to fetch featured clubs:', err);
        return [];
      }
    },
  });

  // Check if user is a club admin
  const isClubAdmin = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
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

  // Check if user is a club member
  const isClubMember = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .maybeSingle();

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

  // Get club by ID
  const getClub = async (clubId: string) => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error fetching club:', error);
        throw error;
      }

      return data as Club;
    } catch (err) {
      console.error('Failed to fetch club:', err);
      throw err;
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

  // Join a club
  const joinClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join a club');
      }

      try {
        const { data, error } = await supabase
          .from('club_members')
          .insert({
            club_id: clubId,
            user_id: profile.id,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data as unknown as ClubMember;
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
          .from('club_members')
          .delete()
          .match({ club_id: clubId, user_id: profile.id })
          .select();

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
    clubs,
    featuredClubs,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    isClubAdmin,
    isClubMember,
    getClub,
    createClub,
    joinClub,
    leaveClub,
  };
};
