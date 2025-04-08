
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useUserSettings } from '@/hooks/useUserSettings';
import {
  Bell,
  Eye,
  Loader2,
  LogOut,
  Shield,
  User,
} from 'lucide-react';

// Import refactored components
import AccountSettings from '@/components/settings/AccountSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import NotificationPreferences from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';

const Settings = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  // Get user settings
  const { isLoading: isSettingsLoading } = useUserSettings();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please log in to view settings</p>
          <Button onClick={() => navigate('/auth')}>Log In</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <div className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
            {isSettingsLoading && (
              <div className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                <span className="text-sm text-muted-foreground">Loading settings...</span>
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="account" className="flex flex-col items-center gap-1 py-2">
                <User size={16} />
                <span className="text-xs">Account</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-2">
                <Shield size={16} />
                <span className="text-xs">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-2">
                <Bell size={16} />
                <span className="text-xs">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="flex flex-col items-center gap-1 py-2">
                <Eye size={16} />
                <span className="text-xs">Display</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4">
              <AccountSettings profile={profile} />
              
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => signOut()}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <PrivacySettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationPreferences />
            </TabsContent>
            
            <TabsContent value="display" className="space-y-4">
              <DisplaySettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Settings;
