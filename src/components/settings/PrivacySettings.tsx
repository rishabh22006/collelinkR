
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Save, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUserSettings } from '@/hooks/useUserSettings';

const PrivacySettings: React.FC = () => {
  const { settings, updatePrivacySettings } = useUserSettings();
  
  const [showEmail, setShowEmail] = React.useState(settings?.privacy?.showEmail ?? true);
  const [showActivity, setShowActivity] = React.useState(settings?.privacy?.showActivity ?? true);
  const [showInstitution, setShowInstitution] = React.useState(settings?.privacy?.showInstitution ?? true);
  
  React.useEffect(() => {
    if (settings?.privacy) {
      setShowEmail(settings.privacy.showEmail);
      setShowActivity(settings.privacy.showActivity);
      setShowInstitution(settings.privacy.showInstitution);
    }
  }, [settings]);
  
  const handlePrivacySettings = () => {
    updatePrivacySettings.mutate({
      showEmail,
      showActivity,
      showInstitution
    });
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
            disabled={updatePrivacySettings.isPending}
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
            disabled={updatePrivacySettings.isPending}
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
            disabled={updatePrivacySettings.isPending}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePrivacySettings} 
          disabled={updatePrivacySettings.isPending}
        >
          {updatePrivacySettings.isPending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
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
