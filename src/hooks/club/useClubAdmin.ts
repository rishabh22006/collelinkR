
import { useClubAdminPermissions } from './useClubAdminPermissions';
import { useClubCreation } from './useClubCreation';
import { useClubManagement } from './useClubManagement';
import { UseClubAdmin } from './clubTypes';

/**
 * Hook for club administration functionality
 * Combines all admin-related hooks into a single interface
 */
export const useClubAdmin = (): UseClubAdmin => {
  const permissions = useClubAdminPermissions();
  const creation = useClubCreation();
  const management = useClubManagement();

  return {
    // Permission checks
    isClubAdmin: permissions.isClubAdmin,
    isClubCreator: permissions.isClubCreator,
    
    // Club creation
    createClub: creation.createClub,
    
    // Admin management
    addClubAdmin: management.addClubAdmin,
    removeClubAdmin: management.removeClubAdmin,
    transferClubOwnership: management.transferClubOwnership,
    getClubMembers: management.getClubMembers,
  };
};
