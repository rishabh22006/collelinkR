
import { useCommunityAdmin } from './useCommunityAdmin';
import { useCommunityMembership } from './useCommunityMembership';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCommunities = () => {
  // Combine admin and membership functionality
  const {
    isCommunityAdmin,
    isCommunityCreator,
    createCommunity,
    addCommunityAdmin,
    removeCommunityAdmin,
    transferCommunityOwnership,
    getCommunityMembers,
  } = useCommunityAdmin();

  const {
    getCommunityMembershipStatus,
    joinCommunity,
    leaveCommunity,
  } = useCommunityMembership();

  // Get all communities
  const getAllCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      return [];
    }
  };

  // Get featured communities
  const getFeaturedCommunities = async () => {
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

      return data || [];
    } catch (err) {
      console.error('Failed to fetch featured communities:', err);
      return [];
    }
  };

  // Get community details
  const getCommunity = async (communityId: string) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          members:community_members(count)
        `)
        .eq('id', communityId)
        .single();

      if (error) {
        console.error('Error fetching community:', error);
        return null;
      }

      // Process the data to add members_count
      const community = {
        ...data,
        members_count: data.members?.[0]?.count || 0
      };

      delete community.members; // Remove the raw members data

      return community;
    } catch (err) {
      console.error('Failed to fetch community:', err);
      return null;
    }
  };

  return {
    // Admin functions
    isCommunityAdmin,
    isCommunityCreator,
    createCommunity,
    addCommunityAdmin,
    removeCommunityAdmin,
    transferCommunityOwnership,
    getCommunityMembers,
    
    // Membership functions
    getCommunityMembershipStatus,
    joinCommunity,
    leaveCommunity,
    
    // Query functions
    getAllCommunities,
    getFeaturedCommunities,
    getCommunity,
  };
};
