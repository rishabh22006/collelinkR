
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useUserSettings } from '@/hooks/useUserSettings';
import {
  Bell,
  Moon,
  Sun,
  Shield,
  User,
  Lock,
  Upload,
  Trash2,
  Save,
  LogOut,
  Languages,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Loader2
} from 'lucide-react';

const Settings = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  // Get user settings
  const { 
    settings, 
    isLoading: isSettingsLoading, 
    updateSettings,
    updateNotificationSettings
  } = useUserSettings();
  
  // Account settings
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Privacy settings
  const [showEmail, setShowEmail] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showInstitution, setShowInstitution] = useState(true);
  
  // Notification settings from user settings
  const [messageNotifications, setMessageNotifications] = useState(
    settings?.notifications?.messages || true
  );
  const [eventNotifications, setEventNotifications] = useState(
    settings?.notifications?.events || true
  );
  const [friendRequestNotifications, setFriendRequestNotifications] = useState(
    settings?.notifications?.friendRequests || true
  );
  const [achievementNotifications, setAchievementNotifications] = useState(
    settings?.notifications?.achievements || true
  );
  const [likeNotifications, setLikeNotifications] = useState(
    settings?.notifications?.likes || true
  );
  const [systemUpdateNotifications, setSystemUpdateNotifications] = useState(
    settings?.notifications?.systemUpdates || true
  );
  
  // Display settings
  const [darkMode, setDarkMode] = useState(
    settings?.theme === 'dark' || 
    (settings?.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
    document.documentElement.classList.contains('dark')
  );
  const [language, setLanguage] = useState(settings?.language || 'en');

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      setMessageNotifications(settings.notifications.messages);
      setEventNotifications(settings.notifications.events);
      setFriendRequestNotifications(settings.notifications.friendRequests);
      setAchievementNotifications(settings.notifications.achievements);
      setLikeNotifications(settings.notifications.likes);
      setSystemUpdateNotifications(settings.notifications.systemUpdates);
      
      const isDark = settings.theme === 'dark' || 
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      
      setLanguage(settings.language);
    }
  }, [settings]);
  
  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio,
          institution
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // This would need to be connected to a confirmation dialog in production
    try {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        await signOut();
        toast.success('Your account has been logged out');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };
  
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update theme in document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Update settings in database
    updateSettings.mutate({
      theme: newDarkMode ? 'dark' : 'light'
    });
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Update settings in database
    updateSettings.mutate({
      language: newLanguage
    });
  };
  
  const handleUpdateNotifications = () => {
    updateNotificationSettings.mutate({
      messages: messageNotifications,
      events: eventNotifications,
      friendRequests: friendRequestNotifications,
      achievements: achievementNotifications,
      likes: likeNotifications,
      systemUpdates: systemUpdateNotifications
    });
  };
  
  const handlePrivacySettings = () => {
    toast.success('Privacy settings updated');
  };
  
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {profile?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Upload size={16} className="mr-2" />
                        Upload Image
                      </Button>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Your university or institution"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Lock size={16} className="mr-2" />
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    These actions are irreversible. Please proceed with caution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-destructive/20 p-4">
                    <h3 className="font-medium mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => signOut()}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control what information is visible to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your email address.
                      </p>
                    </div>
                    <Switch 
                      checked={showEmail}
                      onCheckedChange={setShowEmail}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Activity Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others know when you're online.
                      </p>
                    </div>
                    <Switch 
                      checked={showActivity}
                      onCheckedChange={setShowActivity}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Institution</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your institution in your profile.
                      </p>
                    </div>
                    <Switch 
                      checked={showInstitution}
                      onCheckedChange={setShowInstitution}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePrivacySettings}>
                    <Shield size={16} className="mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Mail size={16} />
                        Message Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when you receive messages.
                      </p>
                    </div>
                    <Switch 
                      checked={messageNotifications}
                      onCheckedChange={setMessageNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming events.
                      </p>
                    </div>
                    <Switch 
                      checked={eventNotifications}
                      onCheckedChange={setEventNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Friend Request Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified about new friend requests.
                      </p>
                    </div>
                    <Switch 
                      checked={friendRequestNotifications}
                      onCheckedChange={setFriendRequestNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified about new achievements.
                      </p>
                    </div>
                    <Switch 
                      checked={achievementNotifications}
                      onCheckedChange={setAchievementNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Like Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when someone likes your content.
                      </p>
                    </div>
                    <Switch 
                      checked={likeNotifications}
                      onCheckedChange={setLikeNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Update Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified about system updates.
                      </p>
                    </div>
                    <Switch 
                      checked={systemUpdateNotifications}
                      onCheckedChange={setSystemUpdateNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateNotifications} 
                    disabled={updateNotificationSettings.isPending}>
                    {updateNotificationSettings.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Bell size={16} className="mr-2" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize how the app looks and feels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                        Dark Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark theme.
                      </p>
                    </div>
                    <Switch 
                      checked={darkMode}
                      onCheckedChange={handleToggleDarkMode}
                      disabled={updateSettings.isPending}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages size={16} />
                      Language
                    </Label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={language}
                      onChange={handleLanguageChange}
                      disabled={updateSettings.isPending}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Settings;
