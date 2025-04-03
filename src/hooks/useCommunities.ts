
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
  is_featured?: boolean | null; 
  is_private?: boolean | null;
  is_verified?: boolean | null; 
  created_at: string;
  updated_at: string | null;
  creator_id: string | null;
  max_admins?: number;
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

      // Process data to ensure consistent structure
      const communities = (data || []).map(community => {
        // Create a properly typed community object with default values
        const typedCommunity: BasicCommunity = {
          id: community.id,
          name: community.name,
          description: community.description,
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          created_at: community.created_at,
          updated_at: community.updated_at,
          creator_id: community.creator_id,
          is_private: community.is_private === true,
          // Optional fields with defaults
          is_featured: 'is_featured' in community ? Boolean(community.is_featured) : false,
          is_verified: 'is_verified' in community ? Boolean(community.is_verified) : false,
          max_admins: community.max_admins || 4
        };
        return typedCommunity;
      });

      return communities;
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

      // Process data to ensure consistent structure
      const communities = (data || []).map(community => {
        // Create a properly typed community object with default values
        const typedCommunity: BasicCommunity = {
          id: community.id,
          name: community.name,
          description: community.description,
          logo_url: community.logo_url,
          banner_url: community.banner_url,
          created_at: community.created_at,
          updated_at: community.updated_at,
          creator_id: community.creator_id,
          is_private: community.is_private === true,
          // We know is_featured is true based on the query
          is_featured: true,
          is_verified: 'is_verified' in community ? Boolean(community.is_verified) : false,
          max_admins: community.max_admins || 4
        };
        return typedCommunity;
      });

      return communities;
    } catch (err) {
      console.error('Failed to fetch featured communities:', err);
      return [];
    }
  };

  // Get community details with explicit typing
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

      // Get member count with a separate query
      const { count: membersCount, error: countError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId);

      if (countError) {
        console.error('Error counting members:', countError);
      }

      // Explicitly define the community details with the correct type
      // and provide default values where needed
      const community: CommunityDetails = {
        id: data.id,
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        banner_url: data.banner_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        creator_id: data.creator_id,
        is_private: data.is_private === true,
        max_admins: data.max_admins || 4,
        members_count: membersCount || 0,
        // Handle potentially missing fields
        is_featured: 'is_featured' in data ? Boolean(data.is_featured) : false,
        is_verified: 'is_verified' in data ? Boolean(data.is_verified) : false
      };

      return community;
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
