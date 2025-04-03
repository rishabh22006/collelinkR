
import { useCommunityAdmin } from './useCommunityAdmin';
import { useCommunityMembership } from './useCommunityMembership';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommunityDetails } from './useClubTypes';

export const useCommunities = () => {
  // Get admin and membership functionality
  const communityAdmin = useCommunityAdmin();
  const communityMembership = useCommunityMembership();

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
  const getCommunity = async (communityId: string): Promise<CommunityDetails | null> => {
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

      // Get member count
      const { count: membersCount, error: countError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId);

      if (countError) {
        console.error('Error counting members:', countError);
      }

      // Process the data to add members_count
      const community = {
        ...data,
        members_count: membersCount || 0
      };

      return community as CommunityDetails;
    } catch (err) {
      console.error('Failed to fetch community:', err);
      return null;
    }
  };

  // Return functionality from all hooks
  return {
    // Admin functions
    isCommunityAdmin: communityAdmin.isCommunityAdmin,
    isCommunityCreator: communityAdmin.isCommunityCreator,
    createCommunity: communityAdmin.createCommunity,
    addCommunityAdmin: communityAdmin.addCommunityAdmin,
    removeCommunityAdmin: communityAdmin.removeCommunityAdmin,
    transferCommunityOwnership: communityAdmin.transferCommunityOwnership,
    getCommunityMembers: communityAdmin.getCommunityMembers,
    
    // Membership functions
    getCommunityMembershipStatus: communityMembership.getCommunityMembershipStatus,
    joinCommunity: communityMembership.joinCommunity,
    leaveCommunity: communityMembership.leaveCommunity,
    
    // Query functions
    getAllCommunities,
    getFeaturedCommunities,
    getCommunity,
  };
};
