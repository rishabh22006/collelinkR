
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

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

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Get user notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      return data as Notification[];
    },
    enabled: !!profile?.id,
  });

  // Get notifications by category
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

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile.id)
        .eq('read', false)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, refetch]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByCategory,
  };
};
