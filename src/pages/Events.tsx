
import React from 'react';
import { motion } from 'framer-motion';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import EventList from '@/components/events/EventList';

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <motion.main 
        className="container py-6 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6">Campus Events</h1>
        <p className="text-muted-foreground mb-8">
          Discover and join exciting events happening across campus. 
          From academic lectures to social gatherings, find events that match your interests.
        </p>
        
        <EventList />
      </motion.main>
      
      <BottomNavbar />
    </div>
  );
};

export default Events;
