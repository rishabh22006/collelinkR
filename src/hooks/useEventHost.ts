
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
  host_type?: 'club' | 'community' | 'user';
  host_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Hook for hosting events functionality
 */
export const useEventHost = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

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
    onSuccess: () => {
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
    hostEvent
  };
};

export default useEventHost;
