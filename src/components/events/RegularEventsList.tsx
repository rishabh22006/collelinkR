
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';
import { motion } from 'framer-motion';

interface RegularEventsListProps {
  events: Event[];
  attendeeCounts: Record<string, number>;
  onRegister: (eventId: string) => void;
}

const RegularEventsList = ({ 
  events, 
  attendeeCounts, 
  onRegister 
}: RegularEventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No events found for this category.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {events
        .filter(event => !event.is_featured)
        .map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EventCard 
              key={event.id} 
              event={event}
              attendeeCount={attendeeCounts[event.id] || 0}
              onRegister={onRegister}
            />
          </motion.div>
        ))}
    </motion.div>
  );
};

export default RegularEventsList;
