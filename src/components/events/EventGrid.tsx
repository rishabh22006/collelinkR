
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Loader2 } from 'lucide-react';
import EventCard from '@/components/events/EventCard';

const EventGrid = () => {
  const { events, isLoading, registerForEvent } = useEvents();
  
  const handleRegister = (eventId: string) => {
    registerForEvent.mutate({ eventId });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading events...</span>
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
        <h3 className="text-xl font-medium mb-2">No events yet</h3>
        <p className="text-muted-foreground">
          Be the first to host an event! Click the "Host Event" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event}
          onRegister={() => handleRegister(event.id)}
        />
      ))}
    </div>
  );
};

export default EventGrid;
