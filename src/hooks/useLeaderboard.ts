
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/types/certificates';
import { useAuth } from './useAuth';

export const useLeaderboard = () => {
  const { profile } = useAuth();

  // Fetch global leaderboard
  const {
    data: leaderboard = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:student_id (
            display_name,
            avatar_url
          )
        `)
        .order('overall_rank', { ascending: true })
        .limit(100);

      if (error) throw error;

      // Flatten the result
      return data.map(entry => ({
        ...entry,
        display_name: entry.profiles?.display_name,
        avatar_url: entry.profiles?.avatar_url,
      })) as LeaderboardEntry[];
    },
    enabled: !!profile?.id,
  });

  // Fetch institution leaderboard
  const {
    data: institutionLeaderboard = [],
    isLoading: isInstitutionLoading,
    error: institutionError,
  } = useQuery({
    queryKey: ['leaderboard', 'institution', profile?.institution],
    queryFn: async () => {
      if (!profile?.institution) return [];

      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:student_id (
            display_name,
            avatar_url
          )
        `)
        .eq('institution', profile.institution)
        .order('institution_rank', { ascending: true })
        .limit(100);

      if (error) throw error;

      // Flatten the result
      return data.map(entry => ({
        ...entry,
        display_name: entry.profiles?.display_name,
        avatar_url: entry.profiles?.avatar_url,
      })) as LeaderboardEntry[];
    },
    enabled: !!profile?.id && !!profile?.institution,
  });

  // Get user's rank
  const {
    data: userRank,
    isLoading: isUserRankLoading,
  } = useQuery({
    queryKey: ['leaderboard', 'user', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('student_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      return data as LeaderboardEntry | null;
    },
    enabled: !!profile?.id,
  });

  return {
    leaderboard,
    institutionLeaderboard,
    userRank,
    isLoading,
    isInstitutionLoading,
    isUserRankLoading,
    error,
    institutionError,
  };
};
