
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, Bell, Eye, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationPreferences from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

// Define mock user profile data
const mockUserProfile = {
  id: 'user-123',
  display_name: 'Alex Johnson',
  email: 'alex.johnson@example.edu',
  avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&dpr=2&q=80',
  bio: 'Computer Science student passionate about web development and AI.',
  institution: 'MIT',
  college: 'School of Engineering',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-15T00:00:00Z',
};

const Settings = () => {
  const { profile, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');
  
  // Use mock profile data for demonstration
  const userProfile = profile || mockUserProfile;

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background">
        <TopNavbar title="Settings" icon={<SettingsIcon size={18} />} />
        
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="account" className="flex flex-col items-center gap-1 p-3 h-auto">
                  <User size={16} />
                  <span className="text-xs">Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 p-3 h-auto">
                  <Bell size={16} />
                  <span className="text-xs">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 p-3 h-auto">
                  <Eye size={16} />
                  <span className="text-xs">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="display" className="flex flex-col items-center gap-1 p-3 h-auto">
                  <SettingsIcon size={16} />
                  <span className="text-xs">Display</span>
                </TabsTrigger>
              </TabsList>
              
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-[150px] w-full" />
                </div>
              ) : (
                <>
                  <TabsContent value="account" className="space-y-6">
                    <AccountSettings profile={userProfile} />
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <NotificationPreferences />
                  </TabsContent>
                  
                  <TabsContent value="privacy">
                    <PrivacySettings />
                  </TabsContent>
                  
                  <TabsContent value="display">
                    <DisplaySettings />
                  </TabsContent>
                </>
              )}
            </Tabs>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                <HelpCircle size={14} />
                Need help? Visit our help center or contact support.
              </p>
            </div>
          </motion.div>
        </main>
        
        <BottomNavbar />
      </div>
    </PageTransition>
  );
};

export default Settings;
