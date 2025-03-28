
import { useClubQuery } from './useClubQuery';
import { useClubMembership } from './useClubMembership';
import { useClubAdmin } from './useClubAdmin';
import { Club, ClubMember, ClubAdmin } from './useClubTypes';

// Export type definitions
export type { Club, ClubMember, ClubAdmin };

/**
 * Main hook that composes all club-related functionality
 */
export const useClubs = () => {
  const clubQuery = useClubQuery();
  const clubMembership = useClubMembership();
  const clubAdmin = useClubAdmin();

  return {
    // From useClubQuery
    clubs: clubQuery.clubs,
    featuredClubs: clubQuery.featuredClubs,
    isLoading: clubQuery.isLoading,
    isFeaturedLoading: clubQuery.isFeaturedLoading,
    error: clubQuery.error,
    refetch: clubQuery.refetch,
    getClub: clubQuery.getClub,

    // From useClubMembership
    isClubMember: clubMembership.isClubMember,
    getMembershipStatus: clubMembership.getMembershipStatus,
    joinClub: clubMembership.joinClub,
    leaveClub: clubMembership.leaveClub,

    // From useClubAdmin
    isClubAdmin: clubAdmin.isClubAdmin,
    createClub: clubAdmin.createClub,
  };
};
