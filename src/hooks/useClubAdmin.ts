
import { useAuthStore } from '@/stores/authStore';
import { useClubCreation } from './club/useClubCreation';
import { useClubAdminPermissions } from './club/useClubAdminPermissions'; 
import { useClubManagement } from './club/useClubManagement';

/**
 * Hook that combines all club admin functionality
 */
export const useClubAdmin = () => {
  const { profile } = useAuthStore();
  const { createClub } = useClubCreation();
  const { isClubAdmin, isClubCreator } = useClubAdminPermissions();
  const { 
    addClubAdmin, 
    removeClubAdmin, 
    transferClubOwnership, 
    getClubMembers 
  } = useClubManagement();

  return {
    isAuthenticated: !!profile?.id,
    isClubAdmin,
    isClubCreator,
    createClub,
    addClubAdmin,
    removeClubAdmin,
    transferClubOwnership,
    getClubMembers
  };
};
