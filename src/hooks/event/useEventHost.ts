
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Event } from '@/types/supabase';
import { useEventPermissions } from './useEventPermissions';
import { useEventNotifications } from './useEventNotifications';

interface HostEventParams {
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location?: string;
  category: string;
  image_url?: string;
  host_type: 'club' | 'community';
  host_id: string;
}

/**
 * Hook for hosting events functionality
 */
export const useEventHost = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();
  const { canHostEvent } = useEventPermissions();
  const { notifyClubMembers, notifyCommunityMembers } = useEventNotifications();

  // Host a new event
  const hostEvent = useMutation({
    mutationFn: async (eventData: HostEventParams) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to host events');
      }

      // Check if user can host this event
      const canHost = await canHostEvent(eventData.host_type, eventData.host_id);
      if (!canHost) {
        throw new Error(`You don't have permission to host events for this ${eventData.host_type}`);
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
            host_id: profile.id,
            community_id: eventData.host_type === 'community' ? eventData.host_id : null,
            host_type: eventData.host_type,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data as unknown as Event;
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      // Create notification for members
      if (data.host_type === 'club') {
        notifyClubMembers(data.host_id || '', data.id, data.title);
      } else if (data.host_type === 'community') {
        notifyCommunityMembers(data.community_id || '', data.id, data.title);
      }
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
