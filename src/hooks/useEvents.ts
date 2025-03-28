
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  host_type: 'club' | 'community' | null;
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

export const useEvents = () => {
  const queryClient = useQueryClient();
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

  // Get event attendees
  const getEventAttendees = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        profiles:attendee_id(id, display_name, avatar_url, email)
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
    mutationFn: async ({ eventId }: { eventId: string }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to register for events');
      }

      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('attendee_id', profile.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existing) {
        throw new Error('You are already registered for this event');
      }

      // Register for the event
      const { data, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          attendee_id: profile.id,
          status: 'registered',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'user', profile?.id] });
    },
    onError: (error: Error) => {
      toast.error('Failed to register for the event', {
        description: error.message,
      });
    },
  });

  // Cancel registration for an event
  const cancelRegistration = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to cancel registration');
      }

      const { data, error } = await supabase
        .from('event_attendees')
        .delete()
        .match({ event_id: eventId, attendee_id: profile.id })
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Registration canceled successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'user', profile?.id] });
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel registration', {
        description: error.message,
      });
    },
  });

  // Export attendee list to Excel
  const exportAttendeeList = async (eventId: string, eventTitle: string) => {
    try {
      if (!profile?.id) {
        toast.error('You must be logged in to export attendee list');
        return;
      }

      // Fetch event details to check if user is the host
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) {
        throw eventError;
      }

      if (event.host_id !== profile.id) {
        toast.error('Only the event host can export the attendee list');
        return;
      }

      // Fetch attendees with profile information
      const attendees = await getEventAttendees(eventId);
      
      // Format data for Excel
      const excelData = attendees.map((item) => ({
        Name: item.profiles.display_name,
        Email: item.profiles.email,
        Status: item.status,
        'Registered At': new Date(item.registered_at).toLocaleString(),
      }));

      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

      // Generate and download Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileName = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.xlsx`;
      
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, fileName);

      toast.success('Attendee list exported successfully');
    } catch (error) {
      console.error('Error exporting attendee list:', error);
      toast.error('Failed to export attendee list');
    }
  };

  return {
    events,
    featuredEvents,
    userEvents,
    isLoading,
    isFeaturedLoading,
    isUserEventsLoading,
    error,
    refetch,
    getEventAttendees,
    registerForEvent,
    cancelRegistration,
    exportAttendeeList,
  };
};
