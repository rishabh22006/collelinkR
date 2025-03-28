
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
        // We need to use raw SQL query since we don't have direct TS types for clubs
        const { data, error } = await supabase
          .rpc('get_all_clubs')
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
          .rpc('get_featured_clubs');

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
      const { data, error } = await supabase
        .rpc('get_club_details', { club_uuid: clubId });

      if (error) {
        console.error('Error fetching club:', error);
        return null;
      }

      // The RPC function returns an array, but we need just the first element
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as ClubDetails;
      }
      
      return null;
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
