
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'like' | 'achievement' | 'friend' | 'system';
  sender_id?: string | null;
  related_id?: string | null;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch user's notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!profile) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate unread count
      const unread = data.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      return data as Notification[];
    },
    enabled: !!profile?.id
  });

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!profile) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to mark notification as read', {
        description: error.message
      });
    }
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', profile.id)
        .eq('read', false)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error: Error) => {
      toast.error('Failed to mark all notifications as read', {
        description: error.message
      });
    }
  });

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Add notification to cache
          queryClient.setQueryData<Notification[]>(['notifications'], (oldData = []) => {
            // Check if notification already exists
            if (oldData.some(n => n.id === newNotification.id)) {
              return oldData;
            }
            
            return [newNotification, ...oldData];
          });
          
          // Update unread count
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          toast(newNotification.title, {
            description: newNotification.content,
            action: {
              label: 'View',
              onClick: () => window.location.href = '/notifications'
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead
  };
};

// Helper function to create a notification
export const createNotification = async ({
  userId,
  title,
  content,
  type,
  senderId = null,
  relatedId = null
}: {
  userId: string;
  title: string;
  content: string;
  type: 'message' | 'event' | 'like' | 'achievement' | 'friend' | 'system';
  senderId?: string | null;
  relatedId?: string | null;
}) => {
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
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
};
