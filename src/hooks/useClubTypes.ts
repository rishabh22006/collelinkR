
import { Database } from '@/integrations/supabase/types';

// Export types from Supabase types
export type Club = Database['public']['Tables']['clubs']['Row'];
export type ClubMember = Database['public']['Tables']['club_members']['Row'];
export type ClubAdmin = Database['public']['Tables']['club_admins']['Row'];

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
