
// Event-related type definitions

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  image_url: string | null;
  is_featured: boolean | null;
  host_id: string | null;
  community_id: string | null;
  created_at: string;
  updated_at: string | null;
  host_type: 'club' | 'community' | 'user' | null;
  metadata?: {
    isOnline?: boolean;
    onlineLink?: string;
    cardColor?: string;
    textColor?: string;
  };
}

export interface EventAttendee {
  id: string;
  event_id: string;
  attendee_id: string;
  status: 'registered' | 'attended' | 'canceled';
  registered_at: string;
}

export interface EventWithAttendance extends Event {
  attendance: EventAttendee;
}
