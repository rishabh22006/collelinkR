
// Type definitions for Supabase database schema

export interface Club {
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
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  joined_at: string;
}

export interface ClubAdmin {
  id: string;
  club_id: string;
  user_id: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  creator_id: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_private: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  updated_at: string | null;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  member_id: string;
  role: string;
  joined_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  image_url: string | null;
  host_id: string | null;
  community_id: string | null;
  host_type: string | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string | null;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  attendee_id: string;
  status: string;
  registered_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'like' | 'achievement' | 'friend' | 'system' | 'club' | 'community';
  sender_id: string | null;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export type Database = {
  tables: {
    clubs: Club;
    club_members: ClubMember;
    club_admins: ClubAdmin;
    communities: Community;
    community_members: CommunityMember;
    events: Event;
    event_attendees: EventAttendee;
    notifications: Notification;
  }
};
