
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { EventAttendee } from '@/types/events';

export const useEventAttendees = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

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
    getEventAttendees,
    registerForEvent,
    cancelRegistration,
    exportAttendeeList,
  };
};
