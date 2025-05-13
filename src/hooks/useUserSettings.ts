
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export interface NotificationSettings {
  messages: boolean;
  events: boolean;
  friendRequests: boolean;
  achievements: boolean;
  likes: boolean;
  systemUpdates: boolean;
}

export interface UserSettings {
  id?: string;
  user_id?: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  privacy: {
    showEmail: boolean;
    showActivity: boolean;
    showInstitution: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

// Mock default settings for demonstration
const mockDefaultSettings: UserSettings = {
  theme: 'system',
  language: 'en',
  notifications: {
    messages: true,
    events: true,
    friendRequests: true,
    achievements: true,
    likes: true,
    systemUpdates: true
  },
  privacy: {
    showEmail: true,
    showActivity: true,
    showInstitution: true
  }
};

export const useUserSettings = () => {
  const { profile } = useAuthStore();
  
  // Query to fetch user settings
  const { data: settings, refetch, isLoading, error } = useQuery({
    queryKey: ['user-settings', profile?.id],
    queryFn: async () => {
      // For now, we'll return mock data
      // In real implementation, this would fetch from Supabase
      console.log('Fetching settings for user:', profile?.id);
      
      // Return mock data for demonstration
      return mockDefaultSettings;
    },
    enabled: !!profile?.id
  });
  
  // Mutation to update settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      console.log('Updating settings:', newSettings);
      
      // In a real implementation, this would update the database
      // For now, we'll simulate success
      return { ...mockDefaultSettings, ...newSettings };
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error('Failed to update settings', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Mutation specifically for notification settings
  const updateNotificationSettings = useMutation({
    mutationFn: async (notificationSettings: NotificationSettings) => {
      console.log('Updating notification settings:', notificationSettings);
      
      // In a real implementation, this would update the database
      return { 
        ...mockDefaultSettings, 
        notifications: notificationSettings 
      };
    },
    onSuccess: () => {
      toast.success('Notification preferences updated');
      refetch();
    },
    onError: (error) => {
      toast.error('Failed to update notification preferences', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Mutation specifically for privacy settings
  const updatePrivacySettings = useMutation({
    mutationFn: async (privacySettings: { showEmail: boolean; showActivity: boolean; showInstitution: boolean }) => {
      console.log('Updating privacy settings:', privacySettings);
      
      // In a real implementation, this would update the database
      return { 
        ...mockDefaultSettings, 
        privacy: privacySettings 
      };
    },
    onSuccess: () => {
      toast.success('Privacy settings updated');
      refetch();
    },
    onError: (error) => {
      toast.error('Failed to update privacy settings', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  return { 
    settings: settings || mockDefaultSettings,
    isLoading,
    error,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    refetch
  };
};
