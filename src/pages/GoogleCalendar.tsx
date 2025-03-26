
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarClock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockEvents } from '@/utils/mockData';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';

// Function to convert mock events to calendar-friendly format
const mapEventsToCalendarFormat = (events) => {
  return events.map(event => ({
    date: new Date(event.date),
    title: event.title,
    category: event.category
  }));
};

const GoogleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(mapEventsToCalendarFormat(mockEvents));
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('month');
  const { profile } = useAuth();

  // Function to highlight dates with events
  const getDayClassNames = (day: Date) => {
    const hasEvent = events.some(event => 
      event.date.toDateString() === day.toDateString()
    );
    
    if (hasEvent) {
      return "bg-primary/20 text-primary font-bold";
    }
    return "";
  };

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
  const getEventsForSelectedDate = () => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Categorize events by type to show them in different colors
  const categorizeEvents = (selectedDateEvents) => {
    const categories = {
      Hackathons: [],
      Workshops: [],
      Fests: [],
      Social: [],
      Sports: [],
      Academic: [],
      Cultural: []
    };
    
    selectedDateEvents.forEach(event => {
      if (categories[event.category]) {
        categories[event.category].push(event);
      } else {
        categories.Other = categories.Other || [];
        categories.Other.push(event);
      }
    });
    
    return categories;
  };

  const selectedDateEvents = getEventsForSelectedDate();
  const categorizedEvents = categorizeEvents(selectedDateEvents);

  // Color mapping for different event categories
  const categoryColors = {
    Hackathons: 'bg-blue-500',
    Workshops: 'bg-green-500',
    Fests: 'bg-purple-500',
    Social: 'bg-yellow-500',
    Sports: 'bg-red-500',
    Academic: 'bg-indigo-500',
    Cultural: 'bg-pink-500',
    Other: 'bg-gray-500'
  };

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
        
        <Tabs defaultValue="month" className="mb-6" onValueChange={setView}>
          <TabsList className="mb-4">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
          
          <TabsContent value="month" className="bg-card p-4 rounded-lg border">
            {isLoading ? (
              <div className="h-[350px] flex justify-center items-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiersClassNames={{
                  selected: "bg-primary text-primary-foreground",
                }}
                modifiers={{
                  customModifier: date => 
                    events.some(event => event.date.toDateString() === date.toDateString())
                }}
                modifiersStyles={{
                  customModifier: { 
                    fontWeight: 'bold',
                    border: '2px solid var(--primary)',
                    backgroundColor: 'rgba(var(--primary), 0.1)' 
                  }
                }}
              />
            )}
          </TabsContent>
          
          <TabsContent value="week" className="p-4 rounded-lg border">
            <p className="text-center text-muted-foreground py-8">
              Week view coming soon! This feature will be available in a future update.
            </p>
          </TabsContent>
          
          <TabsContent value="day" className="p-4 rounded-lg border">
            <p className="text-center text-muted-foreground py-8">
              Day view coming soon! This feature will be available in a future update.
            </p>
          </TabsContent>
        </Tabs>
        
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
              <div className="space-y-4">
                {Object.entries(categorizedEvents).map(([category, categoryEvents]) => {
                  if (categoryEvents.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}></div>
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
            )}
          </CardContent>
        </Card>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default GoogleCalendar;
