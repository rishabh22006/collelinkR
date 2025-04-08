
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const PrivacySettings: React.FC = () => {
  const [showEmail, setShowEmail] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showInstitution, setShowInstitution] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handlePrivacySettings = () => {
    setIsSaving(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // In a real app, this would update privacy settings in the database
      toast.success('Privacy settings updated');
      setIsSaving(false);
    }, 800);
  };
  
  return (
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
            disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePrivacySettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Save size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Shield size={16} className="mr-2" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacySettings;
