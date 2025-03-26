
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { categoryColors } from '@/utils/calendarUtils';

interface EventDetailsProps {
  date: Date | undefined;
  selectedDateEvents: any[];
}

const EventDetails: React.FC<EventDetailsProps> = ({ date, selectedDateEvents }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          Events for {date?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </CardTitle>
        <CardDescription>
          {selectedDateEvents.length === 0 
            ? 'No events scheduled for this day.' 
            : `${selectedDateEvents.length} event(s) scheduled.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedDateEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No events found for this date.</p>
            <p className="mt-2">Select a different date or add a new event.</p>
          </div>
        ) : (
          <EventsList events={selectedDateEvents} />
        )}
      </CardContent>
    </Card>
  );
};

interface EventsListProps {
  events: any[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const categorizedEvents = categorizeEvents(events);
  
  return (
    <div className="space-y-4">
      {Object.entries(categorizedEvents).map(([category, categoryEvents]) => {
        if (categoryEvents.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category]?.bg || 'bg-gray-500'}`}></div>
              {category} ({categoryEvents.length})
            </h3>
            <div className="pl-5 border-l-2 border-muted space-y-2">
              {categoryEvents.map((event, idx) => (
                <div key={idx} className="p-3 rounded-md bg-card border">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to categorize events by type
const categorizeEvents = (selectedDateEvents: any[]) => {
  const categories: Record<string, any[]> = {
    Hackathons: [],
    Workshops: [],
    Fests: [],
    Social: [],
    Sports: [],
    Academic: [],
    Cultural: [],
    Other: []
  };
  
  selectedDateEvents.forEach(event => {
    if (categories[event.category]) {
      categories[event.category].push(event);
    } else {
      categories.Other.push(event);
    }
  });
  
  return categories;
};

export default EventDetails;
