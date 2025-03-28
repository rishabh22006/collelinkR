
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Event } from '@/types/supabase';
import { createNotification } from '@/hooks/useNotifications';
import { useClubAdmin } from './useClubAdmin';

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

export const useEventHost = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();
  const { isClubAdmin } = useClubAdmin();

  // Check if user can host event for a given host type and id
  const canHostEvent = async (hostType: 'club' | 'community', hostId: string) => {
    if (!profile?.id) return false;

    try {
      if (hostType === 'club') {
        // For clubs, check if user is an admin using the refactored function
        return await isClubAdmin(hostId);
      } else if (hostType === 'community') {
        // For communities, check if user is a member
        const { data, error } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', hostId)
          .eq('member_id', profile.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking community membership:', error);
          return false;
        }

        return !!data;
      }
    } catch (err) {
      console.error('Error checking host permissions:', err);
      return false;
    }

    return false;
  };

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

  // Helper to notify club members about new event
  const notifyClubMembers = async (clubId: string, eventId: string, eventTitle: string) => {
    if (!profile?.id) return;

    try {
      // Get all club members except the host
      const { data: members, error } = await supabase
        .from('club_members')
        .select('user_id')
        .eq('club_id', clubId)
        .neq('user_id', profile.id);

      if (error) throw error;

      // Create notification for each member
      for (const member of members || []) {
        try {
          await createNotification({
            userId: member.user_id,
            title: 'New Club Event',
            content: `A new event "${eventTitle}" has been created by a club you're part of`,
            type: 'club',
            senderId: profile.id,
            relatedId: eventId
          });
        } catch (err) {
          console.error('Error creating notification:', err);
        }
      }
    } catch (error) {
      console.error('Error notifying club members:', error);
    }
  };

  // Helper to notify community members about new event
  const notifyCommunityMembers = async (communityId: string, eventId: string, eventTitle: string) => {
    if (!profile?.id) return;

    try {
      // Get all community members except the host
      const { data: members, error } = await supabase
        .from('community_members')
        .select('member_id')
        .eq('community_id', communityId)
        .neq('member_id', profile.id);

      if (error) throw error;

      // Create notification for each member
      for (const member of members || []) {
        try {
          await createNotification({
            userId: member.member_id,
            title: 'New Community Event',
            content: `A new event "${eventTitle}" has been created in a community you're part of`,
            type: 'community',
            senderId: profile.id,
            relatedId: eventId
          });
        } catch (err) {
          console.error('Error creating notification:', err);
        }
      }
    } catch (error) {
      console.error('Error notifying community members:', error);
    }
  };

  return {
    canHostEvent,
    hostEvent
  };
};
