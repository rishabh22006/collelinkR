
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Event } from '@/types/events';

interface HostEventParams {
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location?: string;
  category: string;
  image_url?: string;
  host_type?: 'club' | 'community';
  host_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Hook for hosting events functionality
 */
export const useEventHost = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Check if user can host an event
  const canHostEvent = async (hostType: string, hostId: string | null) => {
    // If no specific host is provided, the user is hosting as themselves
    if (!hostId) return true;

    try {
      if (hostType === 'club') {
        const { data, error } = await supabase.rpc('is_club_admin', { 
          club_uuid: hostId, 
          user_uuid: profile?.id 
        });
        if (error) throw error;
        return data;
      } else if (hostType === 'community') {
        const { data, error } = await supabase.rpc('is_community_admin', { 
          community_uuid: hostId, 
          user_uuid: profile?.id 
        });
        if (error) throw error;
        return data;
      }
      return false;
    } catch (err) {
      console.error('Error checking host permissions:', err);
      return false;
    }
  };

  // Host a new event
  const hostEvent = useMutation({
    mutationFn: async (eventData: HostEventParams) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to host events');
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .insert({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            end_date: eventData.end_date,
            location: eventData.location,
            category: eventData.category,
            image_url: eventData.image_url,
            host_id: eventData.host_id || profile.id,
            community_id: eventData.host_type === 'community' ? eventData.host_id : null,
            host_type: eventData.host_type || 'user',
            metadata: eventData.metadata
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data as Event;
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create event', { 
        description: error.message 
      });
    },
  });

  return {
    canHostEvent,
    hostEvent
  };
};

export default useEventHost;
