
import { supabase } from '@/integrations/supabase/client';
import { BasicCommunity, CommunityDetails } from './communityTypes';

/**
 * Hook for community query functions
 */
export const useCommunityQueries = () => {
  // Get all communities
  const getAllCommunities = async (): Promise<BasicCommunity[]> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, is_featured, is_verified, max_admins')
        .order('name');

      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }

      return (data || []).map(community => ({
        ...community,
        is_private: Boolean(community.is_private),
        is_featured: Boolean(community.is_featured),
        is_verified: Boolean(community.is_verified),
        max_admins: community.max_admins || 4,
      }));
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      return [];
    }
  };

  // Get featured communities
  const getFeaturedCommunities = async (): Promise<BasicCommunity[]> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, is_featured, is_verified, max_admins')
        .eq('is_featured', true)
        .order('name');

      if (error) {
        console.error('Error fetching featured communities:', error);
        return [];
      }

      return (data || []).map(community => ({
        ...community,
        is_private: Boolean(community.is_private),
        is_featured: true, // Already filtered by query
        is_verified: Boolean(community.is_verified),
        max_admins: community.max_admins || 4,
      }));
    } catch (err) {
      console.error('Failed to fetch featured communities:', err);
      return [];
    }
  };

  // Get community details
  const getCommunity = async (communityId: string): Promise<CommunityDetails | null> => {
    try {
      // Get community details
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, is_featured, is_verified, max_admins')
        .eq('id', communityId)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        return null;
      }

      // Get member count separately
      const { count: membersCount, error: countError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId);

      if (countError) {
        console.error('Error counting members:', countError);
      }

      return {
        ...data,
        is_private: Boolean(data.is_private),
        is_featured: Boolean(data.is_featured),
        is_verified: Boolean(data.is_verified),
        max_admins: data.max_admins || 4,
        members_count: membersCount || 0,
      };
    } catch (err) {
      console.error('Failed to fetch community:', err);
      return null;
    }
  };

  return {
    getAllCommunities,
    getFeaturedCommunities,
    getCommunity
  };
};
