
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications, NotificationCategory } from '@/hooks/useNotifications';
import NotificationCategoryFilter from '@/components/notifications/NotificationCategoryFilter';

const Notifications = () => {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    getNotificationsByCategory 
  } = useNotifications();

  const filteredNotifications = getNotificationsByCategory(selectedCategory);

  // Calculate unread counts by category
  const unreadCounts = {
    all: notifications.filter(n => !n.read).length,
    unread: notifications.filter(n => !n.read).length,
    messages: notifications.filter(n => !n.read && n.type === 'message').length,
    events: notifications.filter(n => !n.read && n.type === 'event').length,
    clubs: notifications.filter(n => !n.read && n.type === 'club').length,
    communities: notifications.filter(n => !n.read && n.type === 'community').length,
    other: notifications.filter(n => !n.read && !['message', 'event', 'club', 'community'].includes(n.type)).length,
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'club':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'community':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryTitle = (category: NotificationCategory) => {
    switch (category) {
      case 'all': return 'All Notifications';
      case 'unread': return 'Unread Notifications';
      case 'messages': return 'Messages';
      case 'events': return 'Events';
      case 'clubs': return 'Clubs';
      case 'communities': return 'Communities';
      case 'other': return 'Other Notifications';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <motion.main 
        className="container py-6 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Notifications</h1>
          
          {unreadCounts.all > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <NotificationCategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          unreadCounts={unreadCounts}
        />

        <h2 className="text-xl font-semibold mb-4">{getCategoryTitle(selectedCategory)}</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for new notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <Avatar>
                        <AvatarFallback>
                          {getNotificationIcon(notification.type)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.content}
                      </p>
                      
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.main>
      
      <BottomNavbar />
    </div>
  );
};

export default Notifications;
