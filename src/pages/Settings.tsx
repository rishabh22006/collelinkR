
import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';

const Settings = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  // Account settings
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Privacy settings
  const [showEmail, setShowEmail] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showInstitution, setShowInstitution] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  
  // Display settings
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [language, setLanguage] = useState('English');
  
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
        toast.success('Your account has been deleted');
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
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
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
                    <Save size={16} className="mr-2" />
                    Save Changes
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
                  <Button>
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
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email.
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Smartphone size={16} />
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your device.
                      </p>
                    </div>
                    <Switch 
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming events.
                      </p>
                    </div>
                    <Switch 
                      checked={eventReminders}
                      onCheckedChange={setEventReminders}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Message Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when you receive messages.
                      </p>
                    </div>
                    <Switch 
                      checked={messageNotifications}
                      onCheckedChange={setMessageNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Bell size={16} className="mr-2" />
                    Save Notification Settings
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
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save size={16} className="mr-2" />
                    Save Display Settings
                  </Button>
                </CardFooter>
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
