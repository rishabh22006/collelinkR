
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Loader2, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUserSettings, NotificationSettings } from '@/hooks/useUserSettings';

const NotificationPreferences: React.FC = () => {
  const { settings, updateNotificationSettings } = useUserSettings();
  
  // Default to true to prevent controlled/uncontrolled component warnings
  const [messageNotifications, setMessageNotifications] = React.useState<boolean>(true);
  const [eventNotifications, setEventNotifications] = React.useState<boolean>(true);
  const [friendRequestNotifications, setFriendRequestNotifications] = React.useState<boolean>(true);
  const [achievementNotifications, setAchievementNotifications] = React.useState<boolean>(true);
  const [likeNotifications, setLikeNotifications] = React.useState<boolean>(true);
  const [systemUpdateNotifications, setSystemUpdateNotifications] = React.useState<boolean>(true);

  // Update local state when settings are loaded
  React.useEffect(() => {
    if (settings && settings.notifications) {
      setMessageNotifications(settings.notifications.messages);
      setEventNotifications(settings.notifications.events);
      setFriendRequestNotifications(settings.notifications.friendRequests);
      setAchievementNotifications(settings.notifications.achievements);
      setLikeNotifications(settings.notifications.likes);
      setSystemUpdateNotifications(settings.notifications.systemUpdates);
    }
  }, [settings]);

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
  
  return (
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
        <Button 
          onClick={handleUpdateNotifications} 
          disabled={updateNotificationSettings.isPending}
        >
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
  );
};

export default NotificationPreferences;
