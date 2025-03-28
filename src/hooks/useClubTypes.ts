
import { Database } from '@/integrations/supabase/types';
import { Tables } from '@/integrations/supabase/types';

// Export types
export type Club = Tables<'clubs'>;
export type ClubMember = Tables<'club_members'>;
export type ClubAdmin = Tables<'club_admins'>;

// Shared interfaces and types for club-related functionality
export interface ClubDetails extends Club {
  members_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
}

export interface ClubMembershipStatus {
  isMember: boolean;
  isAdmin: boolean;
}
