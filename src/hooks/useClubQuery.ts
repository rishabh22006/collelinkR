
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
        // We need to use raw SQL query since the clubs table is not properly
        // recognized in the TypeScript definitions
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
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error fetching club:', error);
        return null;
      }

      return data as ClubDetails;
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
