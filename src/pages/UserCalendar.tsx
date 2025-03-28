
import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import CalendarView from '@/components/calendar/CalendarView';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import { useEvents, EventWithAttendance } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';
import { getMonthEvents } from '@/utils/calendarUtils';

const UserCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { userEvents, isUserEventsLoading, refetch } = useEvents();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const handleEventClick = (event: EventWithAttendance) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };
  
  const monthEvents = getMonthEvents(userEvents as unknown as EventWithAttendance[], date);
  
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <motion.main 
        className="container py-6 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Calendar</h1>
          
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={handleRefresh}
              className={cn(isRefreshing && "animate-spin")}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'MMMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="rounded-lg border border-border overflow-hidden">
          <CalendarView 
            events={monthEvents} 
            currentDate={date} 
            onEventClick={handleEventClick}
            isLoading={isUserEventsLoading}
          />
        </div>
      </motion.main>
      
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent}
          open={showModal}
          onClose={closeModal}
        />
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default UserCalendar;
