
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Calendar, Heart, MessageSquare, Clock, Award, ThumbsUp, Users } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "message",
    title: "New message",
    content: "Alex Johnson sent you a message",
    sender: {
      id: "user1",
      name: "Alex Johnson",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "event",
    title: "Upcoming event",
    content: "CS Club Meeting starts in 1 hour",
    relatedId: "event1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "3",
    type: "like",
    title: "Post liked",
    content: "Jamie Williams liked your post",
    sender: {
      id: "user2",
      name: "Jamie Williams",
      avatar: null,
    },
    relatedId: "post1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: "4",
    type: "achievement",
    title: "New certificate",
    content: "You earned a Leadership Certificate",
    relatedId: "cert1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "5",
    type: "friend",
    title: "New friend request",
    content: "Morgan Davis wants to connect",
    sender: {
      id: "user3",
      name: "Morgan Davis",
      avatar: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
];

const Notifications = () => {
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(n => !n.read);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'like':
        return <Heart className="h-5 w-5" />;
      case 'achievement':
        return <Award className="h-5 w-5" />;
      case 'friend':
        return <Users className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getTimeString = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInDays < 7) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d');
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <main className="container py-6">
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  All
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {notifications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              {renderNotifications()}
            </TabsContent>
            
            <TabsContent value="unread" className="space-y-4">
              {unreadCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell size={28} className="text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
                  <p className="text-muted-foreground max-w-md">
                    You have no unread notifications.
                  </p>
                </div>
              ) : (
                renderNotifications()
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
  
  function renderNotifications() {
    const notificationsToShow = filteredNotifications();
    
    if (notificationsToShow.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Notifications Yet</h2>
          <p className="text-muted-foreground max-w-md">
            When you receive notifications about events, messages, or updates, they'll appear here.
          </p>
        </div>
      );
    }
    
    return notificationsToShow.map((notification) => (
      <Card 
        key={notification.id}
        className={cn(
          "flex items-start p-4 cursor-pointer hover:bg-muted/50 transition-colors",
          !notification.read && "border-l-4 border-l-primary"
        )}
        onClick={() => markAsRead(notification.id)}
      >
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full mr-3",
          !notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {notification.sender ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={notification.sender.avatar || ""} />
              <AvatarFallback className={cn(
                !notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {notification.sender.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            getNotificationIcon(notification.type)
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                "font-medium",
                !notification.read && "font-semibold"
              )}>
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground">{notification.content}</p>
            </div>
            <div className="flex flex-col items-end ml-4">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {getTimeString(notification.createdAt)}
              </span>
              {!notification.read && (
                <Badge variant="default" className="mt-1 h-2 w-2 p-0 rounded-full bg-primary" />
              )}
            </div>
          </div>
          
          {notification.type === 'message' && (
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="outline" className="mr-2">
                <MessageSquare className="h-4 w-4 mr-1" /> Reply
              </Button>
            </div>
          )}
          
          {notification.type === 'event' && (
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-1" /> View Event
              </Button>
            </div>
          )}
          
          {notification.type === 'friend' && (
            <div className="mt-2 flex justify-end space-x-2">
              <Button size="sm" variant="outline">
                <ThumbsUp className="h-4 w-4 mr-1" /> Accept
              </Button>
              <Button size="sm" variant="ghost">
                Decline
              </Button>
            </div>
          )}
        </div>
      </Card>
    ));
  }
};

export default Notifications;
