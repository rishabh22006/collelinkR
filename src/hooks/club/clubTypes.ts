
import { BasicCommunity } from '../community/communityTypes';

// Define concrete types for club data
export type Club = {
  id: string;
  name: string;
  description: string | null;
  institution: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string | null;
  creator_id?: string | null;
  max_admins?: number;
};

export interface ClubDetails extends Club {
  members_count?: number;
  member_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
  is_creator?: boolean;
  events?: Array<{
    id: string;
    title: string;
    date: string;
    attendees: number;
  }>;
}

export interface ClubMembershipStatus {
  isMember: boolean;
  isAdmin: boolean;
  isCreator: boolean;
}

export interface ClubMemberWithProfile {
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  display_name: string;
  avatar_url: string | null;
}

export interface AdminManagementResult {
  success: boolean;
  error?: string;
  message: string;
}

// Use a concrete type definition for mutations
export type MutationResult = {
  mutateAsync: (params: any) => Promise<any>;
};

// Define the interface with explicit types
export interface UseClubAdmin {
  isClubAdmin: (clubId: string) => Promise<boolean>;
  isClubCreator: (clubId: string) => Promise<boolean>;
  createClub: MutationResult;
  addClubAdmin: MutationResult;
  removeClubAdmin: MutationResult;
  transferClubOwnership: MutationResult;
  getClubMembers: (clubId: string) => Promise<ClubMemberWithProfile[]>;
}
