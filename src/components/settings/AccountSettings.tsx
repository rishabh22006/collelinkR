
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, Save, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AccountSettingsProps {
  profile: any;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ profile }) => {
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Profile Information Card
  const renderProfileCard = () => (
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
  );

  // Password Card
  const renderPasswordCard = () => (
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
  );

  // Danger Zone Card
  const renderDangerZoneCard = () => (
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
          <Button variant="destructive">
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <Lock size={16} className="mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-4">
      {renderProfileCard()}
      {renderPasswordCard()}
      {renderDangerZoneCard()}
    </div>
  );
};

export default AccountSettings;
