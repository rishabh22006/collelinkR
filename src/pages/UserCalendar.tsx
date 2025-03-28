
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import CalendarView from '@/components/calendar/CalendarView';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import { useEvents } from '@/hooks/useEvents';
import CategoryLegend from '@/components/calendar/CategoryLegend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, List } from "lucide-react";
import DailyEvents from '@/components/calendar/DailyEvents';
import { getMonthEvents } from '@/utils/getMonthEvents';
import { EventWithAttendance } from '@/types/events';

const UserCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('month');
  
  const { events: allEvents } = useEvents();
  
  // Fetch events for the selected month
  const {
    data: events = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['calendar', 'month', format(selectedDate, 'yyyy-MM')],
    queryFn: async () => {
      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
      return getMonthEvents(startDate, endDate);
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  // Handle event click in calendar
  const handleEventClick = (event: EventWithAttendance) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close event details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Convert events to EventWithAttendance[] type
  const eventsWithAttendance = events.map(event => ({
    ...event,
    host_type: event.host_type as "club" | "community" | null,
    attendance: {
      id: '',
      event_id: event.id,
      attendee_id: '',
      status: 'registered' as const,
      registered_at: ''
    }
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNavbar />
      
      <div className="container py-6">
        <h1 className="text-2xl font-semibold mb-4">My Calendar</h1>
        
        <Tabs value={view} onValueChange={setView} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Month View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List size={16} />
              <span>List View</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-500">Academic</Badge>
            <Badge className="bg-green-500">Social</Badge>
            <Badge className="bg-purple-500">Club</Badge>
            <Badge className="bg-amber-500">Competition</Badge>
            <Badge className="bg-red-500">Deadline</Badge>
          </div>
          
          <TabsContent value="month">
            <CalendarView 
              events={events} 
              isLoading={isLoading}
              date={selectedDate}
              setDate={setSelectedDate}
              view={view}
              setView={setView}
              onEventClick={handleEventClick}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <DailyEvents 
              events={eventsWithAttendance.filter((event: EventWithAttendance) => 
                format(new Date(event.date), 'yyyy-MM-dd') === 
                format(selectedDate, 'yyyy-MM-dd')
              )}
              date={selectedDate}
              onEventClick={handleEventClick}
            />
          </TabsContent>
        </Tabs>
        
        <CategoryLegend />
      </div>
      
      {selectedEvent && (
        <EventDetailsModal 
          selectedEvent={selectedEvent}
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default UserCalendar;
