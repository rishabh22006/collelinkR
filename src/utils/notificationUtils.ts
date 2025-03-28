
import { supabase } from '@/integrations/supabase/client';
import { Notification, CreateNotificationParams } from '@/types/notifications';

/**
 * Creates a new notification in the database
 */
export const createNotification = async ({
  userId,
  title,
  content,
  type,
  senderId = null,
  relatedId = null
}: CreateNotificationParams): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      content,
      type,
      sender_id: senderId,
      related_id: relatedId,
      read: false
    })
    .select();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data[0] as Notification;
};
