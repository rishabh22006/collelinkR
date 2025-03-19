
import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Calendar, MessageSquare } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/CustomBadge';

const Profile = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button className="btn-icon">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="container py-6">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 relative">
            <User size={40} className="text-muted-foreground" />
            <div className="absolute bottom-0 right-0">
              <CustomBadge variant="primary" size="sm">New</CustomBadge>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-1">Your Profile</h2>
          <p className="text-muted-foreground mb-4">
            Complete your profile to connect with your campus community.
          </p>
          <div className="flex gap-2 mb-8">
            <Button variant="outline" size="sm">
              <Settings size={14} className="mr-1" />
              Edit Profile
            </Button>
            <Button size="sm">
              <User size={14} className="mr-1" />
              View as Public
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-card rounded-xl p-4 text-center shadow-sm">
              <Calendar size={24} className="mx-auto mb-2 text-primary" />
              <h3 className="font-medium">My Events</h3>
              <p className="text-sm text-muted-foreground">0 events</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-sm">
              <MessageSquare size={24} className="mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Messages</h3>
              <p className="text-sm text-muted-foreground">No messages</p>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Profile;
