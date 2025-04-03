
import { useCommunityPermissions, useCommunityMembers, useCommunityCreation, useCommunityAdminManagement, useCommunityOwnership } from './community';

/**
 * Hook for community administration functionality
 */
export const useCommunityAdmin = () => {
  const { isCommunityAdmin, isCommunityCreator } = useCommunityPermissions();
  const { getCommunityMembers } = useCommunityMembers();
  const { createCommunity } = useCommunityCreation();
  const { addCommunityAdmin, removeCommunityAdmin } = useCommunityAdminManagement();
  const { transferCommunityOwnership } = useCommunityOwnership();

  return {
    isCommunityAdmin,
    isCommunityCreator,
    createCommunity,
    addCommunityAdmin,
    removeCommunityAdmin,
    transferCommunityOwnership,
    getCommunityMembers,
  };
};
