
// Notification-related type definitions
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'like' | 'achievement' | 'friend' | 'system' | 'club' | 'community';
  sender_id: string | null;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export type NotificationCategory = 'all' | 'unread' | 'messages' | 'events' | 'clubs' | 'communities' | 'other';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'like' | 'achievement' | 'friend' | 'system' | 'club' | 'community';
  senderId?: string | null;
  relatedId?: string | null;
}
