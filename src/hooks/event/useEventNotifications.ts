
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { createNotification } from '@/utils/notificationUtils';

/**
 * Utility functions for event-related notifications
 */
export const useEventNotifications = () => {
  const { profile } = useAuthStore();

  /**
   * Notify club members about new event
   */
  const notifyClubMembers = async (clubId: string, eventId: string, eventTitle: string) => {
    if (!profile?.id) return;

    try {
      // Get all club members except the host
      const { data: members, error } = await supabase
        .from('community_members')  // Use community_members instead of club_members
        .select('member_id')
        .eq('community_id', clubId)
        .neq('member_id', profile.id);

      if (error) throw error;

      // Create notification for each member
      for (const member of members || []) {
        try {
          await createNotification({
            userId: member.member_id,
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

  /**
   * Notify community members about new event
   */
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
    notifyClubMembers,
    notifyCommunityMembers
  };
};
