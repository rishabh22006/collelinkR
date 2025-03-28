
import React from 'react';
import CustomBadge from '../ui/CustomBadge';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';

interface FeaturedEventsListProps {
  events: Event[];
  attendeeCounts: Record<string, number>;
  onRegister: (eventId: string) => void;
  isLoading: boolean;
}

const FeaturedEventsList = ({ 
  events, 
  attendeeCounts, 
  onRegister,
  isLoading 
}: FeaturedEventsListProps) => {
  if (isLoading || events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Featured Events</h3>
        <CustomBadge variant="primary" size="sm">Recommended</CustomBadge>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            attendeeCount={attendeeCounts[event.id] || 0}
            onRegister={onRegister}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEventsList;
