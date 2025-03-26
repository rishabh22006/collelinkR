
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/hooks/useEvents';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events
        .filter(event => !event.is_featured)
        .map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            attendeeCount={attendeeCounts[event.id] || 0}
            onRegister={onRegister}
          />
        ))}
    </div>
  );
};

export default RegularEventsList;
