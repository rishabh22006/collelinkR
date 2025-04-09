
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import HostEventForm from '@/components/events/HostEventForm';

const Events = () => {
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  const openHostModal = () => setIsHostModalOpen(true);
  const closeHostModal = () => setIsHostModalOpen(false);

  const handleEventCreated = () => {
    toast.success('Event created successfully!');
    closeHostModal();
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Campus Events</h1>
          <Button onClick={openHostModal} className="gap-2">
            <Plus size={18} />
            Host Event
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Host exciting events happening across campus.
          From academic lectures to social gatherings, create events that match your interests.
        </p>
        
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium mb-2">No events yet</h3>
          <p className="text-muted-foreground">
            Be the first to host an event! Click the "Host Event" button to get started.
          </p>
        </div>

        <HostEventForm 
          open={isHostModalOpen} 
          onClose={closeHostModal}
          onEventCreated={handleEventCreated}
          hostType="user"
          hostId={null}
          hostName="You"
        />
      </motion.main>
      
      <BottomNavbar />
    </div>
  );
};

export default Events;
