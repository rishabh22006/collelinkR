
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import HostEventForm from '@/components/events/HostEventForm';
import EventGrid from '@/components/events/EventGrid';
import { useEvents } from '@/hooks/useEvents';

const Events = () => {
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const { events, isLoading, refetch } = useEvents();

  const openHostModal = () => setIsHostModalOpen(true);
  const closeHostModal = () => setIsHostModalOpen(false);

  const handleEventCreated = () => {
    toast.success('Event created successfully!');
    refetch();
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
          Host and discover exciting events happening across campus.
          From academic lectures to social gatherings, create events that match your interests.
        </p>
        
        <EventGrid />

        <HostEventForm 
          open={isHostModalOpen} 
          onClose={closeHostModal}
          onEventCreated={handleEventCreated}
          hostType="club"
          hostId={null}
          hostName="You"
        />
      </motion.main>
      
      <BottomNavbar />
    </div>
  );
};

export default Events;
