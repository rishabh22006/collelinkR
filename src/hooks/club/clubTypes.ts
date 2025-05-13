
export interface Club {
  id: string;
  name: string;
  description?: string | null;
  institution?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  created_at?: string;
  updated_at?: string;
  creator_id?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  max_admins?: number;
}

export interface ClubDetails extends Club {
  members_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
}

export interface ClubMember {
  id?: string;
  club_id: string;
  user_id: string;
  joined_at?: string;
  display_name?: string;
  avatar_url?: string | null;
}

export interface ClubAdmin {
  id?: string;
  club_id: string;
  user_id: string;
  added_at?: string;
  display_name?: string;
  avatar_url?: string | null;
}

export type ClubMembershipStatus = {
  isMember: boolean;
  isAdmin: boolean;
  isCreator: boolean;
};

export type ClubEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  club_id: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export interface UseClubAdmin {
  isClubAdmin: (clubId: string, userId?: string) => Promise<boolean>;
  isClubCreator: (clubId: string, userId?: string) => Promise<boolean>;
  createClub: any; // Using any type to match existing implementation
  addClubAdmin: (clubId: string, userId: string) => Promise<any>;
  removeClubAdmin: (clubId: string, userId: string) => Promise<any>;
  transferClubOwnership: (clubId: string, newOwnerId: string) => Promise<boolean>;
  getClubMembers: (clubId: string) => Promise<ClubMember[]>;
}

// Example of a club creation request payload
export interface ClubCreationPayload {
  name: string;
  description?: string;
  institution?: string;
}

// Example of a club update request payload
export interface ClubUpdatePayload {
  name?: string;
  description?: string;
  institution?: string;
  is_featured?: boolean;
  is_verified?: boolean;
}
