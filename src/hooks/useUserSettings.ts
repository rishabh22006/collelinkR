
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export interface NotificationSettings {
  messages: boolean;
  events: boolean;
  friendRequests: boolean;
  achievements: boolean;
  likes: boolean;
  systemUpdates: boolean;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  created_at: string;
  updated_at: string;
}

export const useUserSettings = () => {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();

  // Default settings
  const defaultSettings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
    theme: 'system',
    language: 'en',
    notifications: {
      messages: true,
      events: true,
      friendRequests: true,
      achievements: true,
      likes: true,
      systemUpdates: true,
    },
  };

  // Fetch user settings
  const {
    data: settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      if (!profile) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      
      // If no settings exist, create default settings
      if (!data) {
        return createDefaultSettings();
      }
      
      return data as UserSettings;
    },
    enabled: !!profile?.id
  });

  // Create default settings if none exist
  const createDefaultSettings = async () => {
    if (!profile) throw new Error('User not authenticated');
    
    const newSettings = {
      user_id: profile.id,
      ...defaultSettings
    };
    
    const { data, error } = await supabase
      .from('user_settings')
      .insert(newSettings)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as UserSettings;
  };

  // Update user settings
  const updateSettings = useMutation({
    mutationFn: async (updatedSettings: Partial<UserSettings>) => {
      if (!profile || !settings) throw new Error('User not authenticated or settings not loaded');

      const { data, error } = await supabase
        .from('user_settings')
        .update(updatedSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data as UserSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-settings'], data);
      toast.success('Settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update settings', {
        description: error.message
      });
    }
  });

  // Update specific notification settings
  const updateNotificationSettings = useMutation({
    mutationFn: async (notificationSettings: Partial<NotificationSettings>) => {
      if (!profile || !settings) throw new Error('User not authenticated or settings not loaded');

      // Merge with existing notification settings
      const updatedNotifications = {
        ...settings.notifications,
        ...notificationSettings
      };

      const { data, error } = await supabase
        .from('user_settings')
        .update({
          notifications: updatedNotifications
        })
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data as UserSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-settings'], data);
      toast.success('Notification settings updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update notification settings', {
        description: error.message
      });
    }
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSettings,
    updateNotificationSettings
  };
};
