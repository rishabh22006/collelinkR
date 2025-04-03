
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
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, max_admins')
        .order('name');

      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }

      // Map to BasicCommunity type, setting default values for optional properties
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        logo_url: item.logo_url,
        banner_url: item.banner_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
        creator_id: item.creator_id,
        is_private: Boolean(item.is_private),
        // Set default values for missing columns
        is_featured: false, // Default since column might not exist yet
        is_verified: false, // Default since column might not exist yet
        max_admins: item.max_admins || 4,
      }) as BasicCommunity);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      return [];
    }
  };

  // Get featured communities - since is_featured might not exist, we'll return a subset
  const getFeaturedCommunities = async (): Promise<BasicCommunity[]> => {
    try {
      // Since is_featured might not exist yet, we'll just return the first few communities
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, max_admins')
        .order('name')
        .limit(5); // Return a limited set as "featured" until we add the column

      if (error) {
        console.error('Error fetching featured communities:', error);
        return [];
      }

      // Map to BasicCommunity type with is_featured set to true
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        logo_url: item.logo_url,
        banner_url: item.banner_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
        creator_id: item.creator_id,
        is_private: Boolean(item.is_private),
        is_featured: true, // Mark as featured since we're returning them as featured
        is_verified: false, // Default since column might not exist yet
        max_admins: item.max_admins || 4,
      }) as BasicCommunity);
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
        .select('id, name, description, logo_url, banner_url, created_at, updated_at, creator_id, is_private, max_admins')
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

      // Construct the return object explicitly
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
        is_featured: false, // Default since column might not exist yet
        is_verified: false, // Default since column might not exist yet
        max_admins: data.max_admins || 4,
        members_count: membersCount || 0,
      } as CommunityDetails;
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
