
import React, { useState } from 'react';
import EventCard, { EventProps } from './EventCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CustomBadge from '../ui/CustomBadge';

interface EventListProps {
  events: EventProps[];
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

const EventList = ({ events, className }: EventListProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const featuredEvents = events.filter(event => event.isFeatured);
  
  const filteredEvents = events.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

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
      
      {featuredEvents.length > 0 && (
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
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents
          .filter(event => !event.isFeatured)
          .map(event => (
            <EventCard key={event.id} event={event} />
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
