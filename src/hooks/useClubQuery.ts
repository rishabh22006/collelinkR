
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Club, ClubDetails } from './useClubTypes';

/**
 * Hook for fetching club data
 */
export const useClubQuery = () => {
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

  // Get club by ID
  const getClub = async (clubId: string): Promise<ClubDetails | null> => {
    try {
      // Get club details
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (clubError) {
        console.error('Error fetching club:', clubError);
        return null;
      }

      // Get member count
      const { count: membersCount, error: countError } = await supabase
        .from('club_members')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', clubId);

      if (countError) {
        console.error('Error counting members:', countError);
      }

      // Get user's membership status if logged in
      let isMember = false;
      let isAdmin = false;
      let isCreator = false;

      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (userId) {
        // Check if user is a member
        const { data: memberData } = await supabase
          .from('club_members')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', userId)
          .single();

        isMember = !!memberData;

        // Check if user is an admin
        const { data: adminData } = await supabase
          .from('club_admins')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', userId)
          .single();

        isAdmin = !!adminData;

        // Check if user is the creator
        isCreator = clubData.creator_id === userId;
      }

      // Get upcoming events (placeholder for now)
      const events = [
        { id: '1', title: 'Photo Walk', date: '2023-06-15', attendees: 24 },
        { id: '2', title: 'Portrait Workshop', date: '2023-07-10', attendees: 18 },
      ];

      return {
        ...clubData,
        members_count: membersCount || 0,
        is_member: isMember,
        is_admin: isAdmin,
        is_creator: isCreator,
        events
      } as ClubDetails;
    } catch (err) {
      console.error('Failed to fetch club:', err);
      return null;
    }
  };

  return {
    clubs,
    featuredClubs,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    getClub,
  };
};
