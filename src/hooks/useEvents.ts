
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

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
  host_id: string;
  community_id: string | null;
  host_type: 'club' | 'community' | null;
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
  const { profile } = useAuthStore();

  // Fetch all events - now including host_type
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
        .select(`
          *,
          host_club:clubs(name, logo_url),
          host_community:communities(name, logo_url)
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data as unknown as Event[];
    },
  });

  // Fetch featured events
  const {
    data: featuredEvents = [],
    isLoading: isFeaturedLoading,
  } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          host_club:clubs(name, logo_url),
          host_community:communities(name, logo_url)
        `)
        .eq('is_featured', true)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching featured events:', error);
        throw error;
      }

      return data as unknown as Event[];
    },
  });

  // Fetch club events
  const getClubEvents = async (clubId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('host_type', 'club')
      .eq('host_id', clubId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching club events:', error);
      throw error;
    }

    return data as unknown as Event[];
  };

  // Fetch community events
  const getCommunityEvents = async (communityId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('host_type', 'community')
      .eq('host_id', communityId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching community events:', error);
      throw error;
    }

    return data as unknown as Event[];
  };

  // Fetch event attendees
  const getEventAttendees = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        profiles:attendee_id (id, display_name, avatar_url, email)
      `)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching event attendees:', error);
      throw error;
    }

    return data;
  };

  // Register for an event
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

  // Cancel registration for an event
  const cancelEventRegistration = useMutation({
    mutationFn: async (eventId: string) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('You must be logged in to cancel registrations');
      }

      const { error } = await supabase
        .from('event_attendees')
        .update({ status: 'canceled' })
        .eq('event_id', eventId)
        .eq('attendee_id', session.session.user.id);

      if (error) {
        console.error('Cancellation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Successfully canceled event registration');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      toast.error('Cancellation failed', { 
        description: error.message 
      });
    },
  });

  // Export attendee list as CSV
  const exportAttendeeList = async (eventId: string, eventTitle: string) => {
    if (!profile) {
      toast.error('You must be logged in to export attendee lists');
      return;
    }

    try {
      const attendees = await getEventAttendees(eventId);
      
      if (!attendees || attendees.length === 0) {
        toast.info('No attendees to export');
        return;
      }

      // Create CSV content
      let csvContent = "Name,Email,Registration Status,Registration Date\n";
      
      attendees.forEach(attendee => {
        const profile = attendee.profiles;
        csvContent += `"${profile.display_name}","${profile.email}","${attendee.status}","${new Date(attendee.registered_at).toLocaleString()}"\n`;
      });

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Attendee list exported successfully');
    } catch (error) {
      console.error('Error exporting attendee list:', error);
      toast.error('Failed to export attendee list');
    }
  };

  return {
    events,
    featuredEvents,
    isLoading,
    isFeaturedLoading,
    error,
    refetch,
    getEventAttendees,
    registerForEvent,
    cancelEventRegistration,
    getClubEvents,
    getCommunityEvents,
    exportAttendeeList
  };
};

// Hook to get user's registration status for an event
export const useEventRegistration = (eventId: string) => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['eventRegistration', eventId],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('attendee_id', profile.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Event registration check error:', error);
        throw error;
      }

      return data as unknown as EventAttendee | null;
    },
    enabled: !!profile?.id && !!eventId,
  });
};
