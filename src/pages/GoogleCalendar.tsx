
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockEvents } from '@/utils/mockData';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import CalendarView from '@/components/calendar/CalendarView';
import EventDetails from '@/components/calendar/EventDetails';
import CategoryLegend from '@/components/calendar/CategoryLegend';
import { mapEventsToCalendarFormat, getEventsForDate } from '@/utils/calendarUtils';

const GoogleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(mapEventsToCalendarFormat(mockEvents));
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('month');
  const { profile } = useAuth();

  // Function to simulate fetching events from Google Calendar
  const refreshEvents = () => {
    setIsLoading(true);
    // Simulating API call delay
    setTimeout(() => {
      setEvents(mapEventsToCalendarFormat(mockEvents));
      setIsLoading(false);
    }, 1000);
  };

  // Get events for the selected date
  const selectedDateEvents = getEventsForDate(events, date);

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="container py-6 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshEvents}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <CalendarView 
          date={date}
          setDate={setDate}
          events={events}
          isLoading={isLoading}
          view={view}
          setView={setView}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <EventDetails 
              date={date} 
              selectedDateEvents={selectedDateEvents} 
            />
          </div>
          
          <div className="md:col-span-5">
            <CategoryLegend />
          </div>
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default GoogleCalendar;
