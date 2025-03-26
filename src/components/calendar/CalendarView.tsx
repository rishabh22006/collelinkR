
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: any[];
  isLoading: boolean;
  view: string;
  setView: (view: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  date, 
  setDate, 
  events, 
  isLoading, 
  view, 
  setView 
}) => {
  // Helper to get dates with events for highlighting in the calendar
  const getDayClassNames = (day: Date) => {
    // Check if any events are on this day
    const hasEvents = events.some(event => isSameDay(new Date(event.date), day));
    
    return cn(
      isToday(day) && "bg-accent text-accent-foreground",
      hasEvents && "bg-primary/15 font-semibold"
    );
  };

  return (
    <Tabs defaultValue="month" className="mb-6" onValueChange={setView} value={view}>
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
                events.some(event => isSameDay(new Date(event.date), date))
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
  );
};

export default CalendarView;
