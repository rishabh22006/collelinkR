
import { useCommunityAdmin } from './useCommunityAdmin';
import { useCommunityMembership } from './useCommunityMembership';
import { supabase } from '@/integrations/supabase/client';
import { CommunityDetails } from './useClubTypes';

// Define concrete types for community data to avoid complex type inference
type BasicCommunity = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_featured: boolean | null;
  is_private: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string | null;
  creator_id: string | null;
  max_admins: number;
};

// Use a concrete type definition for mutations
type MutationResult = {
  mutateAsync: (params: any) => Promise<any>;
};

// Define the interface with explicit types
interface UseCommunities {
  // Admin functions
  isCommunityAdmin: (communityId: string) => Promise<boolean>;
  isCommunityCreator: (communityId: string) => Promise<boolean>;
  createCommunity: MutationResult;
  addCommunityAdmin: MutationResult;
  removeCommunityAdmin: MutationResult;
  transferCommunityOwnership: MutationResult;
  getCommunityMembers: (communityId: string) => Promise<any[]>;
  
  // Membership functions
  getCommunityMembershipStatus: (communityId: string) => Promise<{
    isMember: boolean;
    isAdmin: boolean;
    isCreator: boolean;
  }>;
  joinCommunity: MutationResult;
  leaveCommunity: MutationResult;
  
  // Query functions
  getAllCommunities: () => Promise<BasicCommunity[]>;
  getFeaturedCommunities: () => Promise<BasicCommunity[]>;
  getCommunity: (communityId: string) => Promise<CommunityDetails | null>;
}

/**
 * Hook for community functionality
 */
export const useCommunities = (): UseCommunities => {
  // Get admin and membership functionality
  const communityAdmin = useCommunityAdmin();
  const communityMembership = useCommunityMembership();

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

      return data || [];
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

  // Return an object that explicitly matches our interface to avoid type inference issues
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
