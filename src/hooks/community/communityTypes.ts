
// Define concrete types for community data to avoid complex type inference
export type BasicCommunity = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_featured?: boolean; 
  is_private?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at: string | null;
  creator_id: string | null;
  max_admins?: number;
};

// Use a concrete type definition for mutations
export type MutationResult = {
  mutateAsync: (params: any) => Promise<any>;
};

// Explicitly define CommunityDetails to prevent recursion
export interface CommunityDetails extends BasicCommunity {
  members_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
  is_creator?: boolean;
}

// Define the interface with explicit types
export interface UseCommunities {
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
