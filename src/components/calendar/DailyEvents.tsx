
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Clock, MapPin, CalendarIcon } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { getCategoryColor } from '@/utils/calendarUtils';
import { Badge } from '@/components/ui/badge';

interface EventWithAttendance extends Event {
  attendance?: {
    id: string;
    event_id: string;
    attendee_id: string;
    registered_at: string;
    status: "registered" | "attended" | "canceled";
  };
}

interface DailyEventsProps {
  date: Date;
  events: EventWithAttendance[];
  onEventClick: (event: EventWithAttendance) => void;
}

const DailyEvents: React.FC<DailyEventsProps> = ({ date, events, onEventClick }) => {
  // Format the event time for display
  const formatEventTime = (dateStr: string) => {
    return format(new Date(dateStr), 'h:mm a');
  };

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const eventsForDate = getEventsForDate(date);

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{format(date, 'MMMM d, yyyy')}</h2>
        <p className="text-sm text-muted-foreground">
          {eventsForDate.length} events scheduled
        </p>
      </div>
      
      <div className="divide-y">
        {events.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading your events...</p>
          </div>
        ) : eventsForDate.length > 0 ? (
          eventsForDate.map(event => {
            const { bg, text } = getCategoryColor(event.category);
            return (
              <div 
                key={event.id}
                className="p-4 hover:bg-secondary/10 cursor-pointer transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between mb-2">
                  <Badge className={`${bg} ${text}`}>{event.category}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock size={14} />
                    <span>{formatEventTime(event.date)}</span>
                  </div>
                </div>
                <h3 className="font-medium">{event.title}</h3>
                {event.location && (
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="font-medium mb-1">No events for this day</p>
            <p className="text-sm text-muted-foreground">
              Select a different date or register for more events
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEvents;
