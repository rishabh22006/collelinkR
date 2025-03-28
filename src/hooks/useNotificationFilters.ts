
import { Notification, NotificationCategory } from '@/types/notifications';

/**
 * Hook to filter notifications by category
 */
export const useNotificationFilters = (notifications: Notification[]) => {
  /**
   * Filters notifications by category
   */
  const getNotificationsByCategory = (category: NotificationCategory) => {
    if (category === 'all') return notifications;
    if (category === 'unread') return notifications.filter(n => !n.read);
    if (category === 'messages') return notifications.filter(n => n.type === 'message');
    if (category === 'events') return notifications.filter(n => n.type === 'event');
    if (category === 'clubs') return notifications.filter(n => n.type === 'club');
    if (category === 'communities') return notifications.filter(n => n.type === 'community');
    if (category === 'other') {
      return notifications.filter(n => 
        !['message', 'event', 'club', 'community'].includes(n.type)
      );
    }
    return [];
  };

  /**
   * Calculate unread counts by category
   */
  const getUnreadCounts = () => {
    return {
      all: notifications.filter(n => !n.read).length,
      unread: notifications.filter(n => !n.read).length,
      messages: notifications.filter(n => !n.read && n.type === 'message').length,
      events: notifications.filter(n => !n.read && n.type === 'event').length,
      clubs: notifications.filter(n => !n.read && n.type === 'club').length,
      communities: notifications.filter(n => !n.read && n.type === 'community').length,
      other: notifications.filter(n => !n.read && !['message', 'event', 'club', 'community'].includes(n.type)).length,
    };
  };

  return {
    getNotificationsByCategory,
    getUnreadCounts
  };
};
