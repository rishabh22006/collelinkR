
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface ClubEventsListProps {
  events: any[];
}

const ClubEventsList = ({ events }: ClubEventsListProps) => {
  if (!events || events.length === 0) {
    return <p className="text-muted-foreground text-center py-6">No upcoming events</p>;
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <motion.div 
          key={event.id}
          whileHover={{ scale: 1.01 }}
          className="border rounded-lg p-3"
        >
          <h4 className="font-medium">{event.title}</h4>
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>{event.date}</span>
            <span>{event.attendees} attending</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ClubEventsList;
