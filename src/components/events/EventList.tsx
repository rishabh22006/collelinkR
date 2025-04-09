
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import CategoryFilter from './CategoryFilter';
import FeaturedEventsList from './FeaturedEventsList';
import RegularEventsList from './RegularEventsList';
import { useNavigate } from 'react-router-dom';

interface EventListProps {
  className?: string;
}

const EventList = ({ className }: EventListProps) => {
  const navigate = useNavigate();
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
  
  const categories = ['All'];
  
  // Extract unique categories from events
  useEffect(() => {
    if (events.length > 0) {
      const uniqueCategories = [...new Set(events.map(event => event.category))];
      if (uniqueCategories.length > 0 && !categories.includes('All')) {
        categories.push('All');
      }
      uniqueCategories.forEach(category => {
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      });
    }
  }, [events]);
  
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleViewAll = () => {
    navigate('/events');
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
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Events</h2>
          <Button variant="outline" size="sm" onClick={handleViewAll}>View All</Button>
        </div>
        
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-3">No events have been created yet</p>
          <Button onClick={handleViewAll} size="sm">Host an Event</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Events</h2>
        <Button variant="outline" size="sm" onClick={handleViewAll}>View All</Button>
      </div>
      
      {categories.length > 1 && (
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      <FeaturedEventsList
        events={featuredEvents}
        attendeeCounts={attendeeCounts}
        onRegister={handleRegister}
        isLoading={isFeaturedLoading}
      />
      
      <RegularEventsList
        events={filteredEvents}
        attendeeCounts={attendeeCounts}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default EventList;
