
import { useClubQuery } from './useClubQuery';
import { useClubAdmin } from './useClubAdmin';
import { useClubMembership } from './useClubMembership';
import { Club, ClubDetails, ClubMembershipStatus } from './useClubTypes';

export type { Club, ClubDetails, ClubMembershipStatus };

export const useClubs = () => {
  // Combine query, admin and membership functionality
  const {
    clubs,
    featuredClubs,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    getClub,
  } = useClubQuery();

  const {
    isClubAdmin,
    createClub,
  } = useClubAdmin();

  const {
    joinClub,
    leaveClub,
    getClubMembershipStatus,
  } = useClubMembership();

  // Return all functionality from all hooks
  return {
    // Club queries
    clubs,
    featuredClubs,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    getClub,
    
    // Admin functionality
    isClubAdmin,
    createClub,
    
    // Membership management
    joinClub,
    leaveClub,
    getClubMembershipStatus,
  };
};
