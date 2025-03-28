
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
  is_featured: boolean;
  is_verified: boolean;
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

  // Fetch all clubs - optimized with filtering for verified clubs
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
        .eq('is_verified', true)
        .order('name');

      if (error) {
        console.error('Error fetching clubs:', error);
        throw error;
      }

      return data as unknown as Club[];
    },
  });

  // Fetch featured clubs
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
        .eq('is_verified', true)
        .order('name');

      if (error) {
        console.error('Error fetching featured clubs:', error);
        throw error;
      }

      return data as unknown as Club[];
    },
  });

  // Check if user is club admin
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

  // Get club members
  const getClubMembers = async (clubId: string) => {
    const { data, error } = await supabase
      .from('club_members')
      .select(`
        *,
        profiles:user_id (id, display_name, avatar_url)
      `)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error fetching club members:', error);
      throw error;
    }

    return data;
  };

  // Join a club
  const joinClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to join clubs');
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
        // Check if user is already a member
        if (error.code === '23505') {
          throw new Error('You are already a member of this club');
        }
        throw error;
      }

      return data as unknown as ClubMember;
    },
    onSuccess: () => {
      toast.success('Successfully joined the club!');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to join club', { 
        description: error.message 
      });
    },
  });

  // Leave a club
  const leaveClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to leave clubs');
      }

      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', clubId)
        .eq('user_id', profile.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Successfully left the club');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to leave club', { 
        description: error.message 
      });
    },
  });

  // Create a club
  const createClub = useMutation({
    mutationFn: async (clubData: Partial<Club>) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to create clubs');
      }

      // First insert the club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubData.name,
          description: clubData.description,
          institution: clubData.institution || profile.institution,
          logo_url: clubData.logo_url,
          banner_url: clubData.banner_url,
          is_featured: false,
          is_verified: false, // Clubs start unverified
        })
        .select()
        .single();

      if (clubError) {
        throw clubError;
      }

      // Then make the creator an admin
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({
          club_id: clubData.id,
          user_id: profile.id,
        });

      if (adminError) {
        // Rollback club creation if admin assignment fails
        await supabase.from('clubs').delete().eq('id', clubData.id);
        throw adminError;
      }

      // And also make them a member
      const { error: memberError } = await supabase
        .from('club_members')
        .insert({
          club_id: clubData.id,
          user_id: profile.id,
        });

      if (memberError && memberError.code !== '23505') { // Ignore duplicate membership errors
        throw memberError;
      }

      return clubData as unknown as Club;
    },
    onSuccess: () => {
      toast.success('Club created successfully!');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create club', { 
        description: error.message 
      });
    },
  });

  return {
    clubs,
    featuredClubs,
    isLoading,
    isFeaturedLoading,
    isClubAdmin,
    getClubMembers,
    joinClub,
    leaveClub,
    createClub,
    refetch,
  };
};

// Hook to check if user is a member of a club
export const useClubMembership = (clubId: string) => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['clubMembership', clubId],
    queryFn: async () => {
      if (!profile?.id || !clubId) return null;
      
      const { data, error } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Club membership check error:', error);
        throw error;
      }

      return data as unknown as ClubMember | null;
    },
    enabled: !!profile?.id && !!clubId,
  });
};
