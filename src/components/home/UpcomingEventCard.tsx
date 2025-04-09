
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAttendeeCount } from '@/utils/dataUtils';

interface UpcomingEventCardProps {
  event: any;
}

const UpcomingEventCard = ({ event }: UpcomingEventCardProps) => {
  return (
    <motion.div 
      className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <h3 className="font-medium">{event.title}</h3>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-2" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-2" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Users size={14} className="mr-2" />
          <span>{getAttendeeCount(event)} attending</span>
        </div>
      </div>
      <Link to={`/events/${event.id}`}>
        <Button variant="outline" size="sm" className="mt-3 w-full">View Details</Button>
      </Link>
    </motion.div>
  );
};

export default UpcomingEventCard;
