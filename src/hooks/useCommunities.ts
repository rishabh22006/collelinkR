
import { useCommunityAdmin } from './useCommunityAdmin';
import { useCommunityMembership } from './useCommunityMembership';
import { useCommunityQueries } from './community/useCommunityQueries';
import { UseCommunities } from './community/communityTypes';

/**
 * Hook that combines all community functionality
 */
export const useCommunities = (): UseCommunities => {
  // Get admin and membership functionality
  const communityAdmin = useCommunityAdmin();
  const communityMembership = useCommunityMembership();
  const communityQueries = useCommunityQueries();

  // Return an object that explicitly matches our interface
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
    getAllCommunities: communityQueries.getAllCommunities,
    getFeaturedCommunities: communityQueries.getFeaturedCommunities,
    getCommunity: communityQueries.getCommunity,
  };
};
