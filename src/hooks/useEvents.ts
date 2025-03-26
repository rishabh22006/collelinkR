
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  host_id: string | null;
  community_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  attendee_id: string;
  status: 'registered' | 'attended' | 'canceled';
  registered_at: string;
}

export const useEvents = () => {
  const queryClient = useQueryClient();

  // Fetch all events - now optimized with indexes
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

      return data as unknown as Event[];
    },
  });

  // Fetch featured events - now optimized with indexes
  const {
    data: featuredEvents = [],
    isLoading: isFeaturedLoading,
  } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true as any)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching featured events:', error);
        throw error;
      }

      return data as unknown as Event[];
    },
  });

  // Fetch event attendees - now optimized with indexes
  const getEventAttendees = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId as any);

    if (error) {
      console.error('Error fetching event attendees:', error);
      throw error;
    }

    return data as unknown as EventAttendee[];
  };

  // Register for an event - now protected with RLS
  const registerForEvent = useMutation({
    mutationFn: async ({ eventId, status = 'registered' }: { eventId: string; status?: 'registered' | 'attended' | 'canceled' }) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('You must be logged in to register for events');
      }

      const { data, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId as any,
          attendee_id: session.session.user.id as any,
          status: status as any,
        })
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate registration
        if (error.code === '23505') {
          throw new Error('You are already registered for this event');
        }
        console.error('Registration error:', error);
        throw error;
      }

      return data as unknown as EventAttendee;
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      toast.error('Registration failed', { 
        description: error.message 
      });
    },
  });

  return {
    events,
    featuredEvents,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    getEventAttendees,
    registerForEvent,
  };
};

// Hook to get user's registration status for an event - now optimized with indexes
export const useEventRegistration = (eventId: string) => {
  return useQuery({
    queryKey: ['eventRegistration', eventId],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) return null;
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId as any)
        .eq('attendee_id', sessionData.session.user.id as any)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Event registration check error:', error);
        throw error;
      }

      return data as unknown as EventAttendee | null;
    },
    enabled: !!eventId,
  });
};
