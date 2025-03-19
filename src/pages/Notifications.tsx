
import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';

const Notifications = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
      </header>

      <main className="container py-6">
        <motion.div 
          className="flex flex-col items-center justify-center py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No New Notifications</h2>
          <p className="text-muted-foreground max-w-md">
            When you receive notifications about events, messages, or updates, they'll appear here.
          </p>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Notifications;
