
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Event, EventWithAttendance } from '@/types/events';

export const useEventQuery = () => {
  const { profile } = useAuthStore();

  // Get all events
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data as Event[];
    },
  });

  // Get featured events
  const {
    data: featuredEvents = [],
    isLoading: isFeaturedLoading,
  } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching featured events:', error);
        throw error;
      }

      return data as Event[];
    },
  });

  // Get user registered events
  const {
    data: userEvents = [],
    isLoading: isUserEventsLoading,
  } = useQuery({
    queryKey: ['events', 'user', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          event:event_id(*)
        `)
        .eq('attendee_id', profile.id);

      if (error) {
        console.error('Error fetching user events:', error);
        throw error;
      }

      // Transform data to include event details with attendance info
      return data.map((attendee) => ({
        ...attendee.event,
        attendance: {
          id: attendee.id,
          event_id: attendee.event_id,
          attendee_id: attendee.attendee_id,
          status: attendee.status,
          registered_at: attendee.registered_at,
        },
      })) as EventWithAttendance[];
    },
    enabled: !!profile?.id,
  });

  return {
    events,
    featuredEvents,
    userEvents,
    isLoading,
    isFeaturedLoading,
    isUserEventsLoading,
    error,
    refetch,
  };
};
