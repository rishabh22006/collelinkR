
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export interface Club {
  id: string;
  name: string;
  description: string | null;
  institution: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string | null;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  joined_at: string;
}

export interface ClubAdmin {
  id: string;
  club_id: string;
  user_id: string;
  created_at: string;
}

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
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching clubs:', error);
        throw error;
      }

      return data as Club[];
    },
  });

  // Get featured clubs
  const {
    data: featuredClubs = [],
    isLoading: isFeaturedLoading,
  } = useQuery({
    queryKey: ['clubs', 'featured'],
    queryFn: async () => {
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
    },
  });

  // Check if user is a club admin
  const isClubAdmin = async (clubId: string) => {
    if (!profile?.id) return false;

    const { data, error } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .maybeSingle();

    if (error) {
      console.error('Error checking club admin status:', error);
      return false;
    }

    return !!data;
  };

  // Check if user is a club member
  const isClubMember = async (clubId: string) => {
    if (!profile?.id) return false;

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
  };

  // Get club by ID
  const getClub = async (clubId: string) => {
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

      return data as ClubMember;
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

      const { data, error } = await supabase
        .from('club_members')
        .delete()
        .match({ club_id: clubId, user_id: profile.id })
        .select();

      if (error) {
        throw error;
      }

      return data;
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
