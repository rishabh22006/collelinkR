
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
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }

      // Process data to ensure consistent structure
      const communities = (data || []).map(community => ({
        id: community.id,
        name: community.name,
        description: community.description,
        logo_url: community.logo_url,
        banner_url: community.banner_url,
        created_at: community.created_at,
        updated_at: community.updated_at,
        creator_id: community.creator_id,
        is_private: Boolean(community.is_private),
        is_featured: 'is_featured' in community ? Boolean(community.is_featured) : false,
        is_verified: 'is_verified' in community ? Boolean(community.is_verified) : false,
        max_admins: community.max_admins || 4
      } as BasicCommunity));

      return communities;
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
        .select('*')
        .eq('is_featured', true)
        .order('name');

      if (error) {
        console.error('Error fetching featured communities:', error);
        return [];
      }

      // Process data to ensure consistent structure
      const communities = (data || []).map(community => ({
        id: community.id,
        name: community.name,
        description: community.description,
        logo_url: community.logo_url,
        banner_url: community.banner_url,
        created_at: community.created_at,
        updated_at: community.updated_at,
        creator_id: community.creator_id,
        is_private: Boolean(community.is_private),
        // We know is_featured is true based on the query
        is_featured: true,
        is_verified: 'is_verified' in community ? Boolean(community.is_verified) : false,
        max_admins: community.max_admins || 4
      } as BasicCommunity));

      return communities;
    } catch (err) {
      console.error('Failed to fetch featured communities:', err);
      return [];
    }
  };

  // Get community details with explicit typing
  const getCommunity = async (communityId: string): Promise<Partial<CommunityDetails> | null> => {
    try {
      // Get community details
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        return null;
      }

      // Get member count with a separate query
      const { count: membersCount, error: countError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId);

      if (countError) {
        console.error('Error counting members:', countError);
      }

      // Use type assertion with Pick<> to limit properties and avoid excessive recursion
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        banner_url: data.banner_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        creator_id: data.creator_id,
        is_private: Boolean(data.is_private),
        max_admins: data.max_admins || 4,
        members_count: membersCount || 0,
        is_featured: 'is_featured' in data ? Boolean(data.is_featured) : false,
        is_verified: 'is_verified' in data ? Boolean(data.is_verified) : false
      } as Pick<CommunityDetails, keyof CommunityDetails>;
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
