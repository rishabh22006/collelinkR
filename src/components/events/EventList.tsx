
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CustomBadge from '../ui/CustomBadge';
import EventCard from './EventCard';
import { useEvents } from '@/hooks/useEvents';
import { Loader2 } from 'lucide-react';

interface EventListProps {
  className?: string;
}

const categories = [
  'All',
  'Hackathons',
  'Workshops',
  'Fests',
  'Social',
  'Sports',
  'Academic'
];

const EventList = ({ className }: EventListProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});
  
  const { 
    events, 
    featuredEvents, 
    isLoading, 
    isFeaturedLoading, 
    getEventAttendees,
    registerForEvent
  } = useEvents();
  
  const filteredEvents = events.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

  // Load attendee counts
  useEffect(() => {
    const loadAttendeeCounts = async () => {
      const counts: Record<string, number> = {};
      
      for (const event of events) {
        try {
          const attendees = await getEventAttendees(event.id);
          counts[event.id] = attendees.length;
        } catch (error) {
          console.error(`Error loading attendees for event ${event.id}:`, error);
          counts[event.id] = 0;
        }
      }
      
      setAttendeeCounts(counts);
    };
    
    if (events.length > 0) {
      loadAttendeeCounts();
    }
  }, [events, getEventAttendees]);

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

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Events</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {!isFeaturedLoading && featuredEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Featured Events</h3>
            <CustomBadge variant="primary" size="sm">Recommended</CustomBadge>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {featuredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                variant="featured"
                attendeeCount={attendeeCounts[event.id] || 0}
                onRegister={handleRegister}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents
          .filter(event => !event.is_featured)
          .map(event => (
            <EventCard 
              key={event.id} 
              event={event}
              attendeeCount={attendeeCounts[event.id] || 0}
              onRegister={handleRegister}
            />
          ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No events found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
