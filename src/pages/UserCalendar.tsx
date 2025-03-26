
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay, isToday } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';
import CategoryLegend from '@/components/calendar/CategoryLegend';
import DailyEvents from '@/components/calendar/DailyEvents';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import { toast } from 'sonner';
import { getCategoryColor } from '@/utils/calendarUtils';

interface EventWithAttendance extends Event {
  attendance?: {
    id: string;
    event_id: string;
    attendee_id: string;
    registered_at: string;
    status: "registered" | "attended" | "canceled";
  };
}

const UserCalendar = () => {
  const { session, profile } = useAuthStore();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventWithAttendance[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendance | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  // Function to load user's registered events
  const loadUserEvents = async () => {
    if (!session?.user?.id) return;
    
    setLoadingEvents(true);
    
    try {
      // Get user's event registrations
      const { data: attendances, error: attendanceError } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('attendee_id', session.user.id);
        
      if (attendanceError) throw attendanceError;
      
      if (attendances && attendances.length > 0) {
        const eventIds = attendances.map(a => a.event_id);
        
        // Get the event details for the user's registrations
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .in('id', eventIds);
          
        if (eventsError) throw eventsError;
        
        // Combine event data with attendance information
        const eventsWithAttendance: EventWithAttendance[] = eventsData.map(event => {
          const attendance = attendances.find(a => a.event_id === event.id);
          
          // Ensure we cast the status to the correct type
          return {
            ...event,
            attendance: attendance ? {
              ...attendance,
              status: attendance.status as "registered" | "attended" | "canceled"
            } : undefined
          };
        });
        
        setEvents(eventsWithAttendance);
        
        // Initialize reminders state from localStorage
        const savedReminders = localStorage.getItem('eventReminders');
        if (savedReminders) {
          setReminders(JSON.parse(savedReminders));
        } else {
          // Default to true for all events if not set
          const defaultReminders: Record<string, boolean> = {};
          eventsWithAttendance.forEach(event => {
            defaultReminders[event.id] = true;
          });
          setReminders(defaultReminders);
          localStorage.setItem('eventReminders', JSON.stringify(defaultReminders));
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load your events');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadUserEvents();
  }, [session?.user?.id]);

  // Handle setting reminders
  const toggleReminder = (eventId: string) => {
    const newReminders = { ...reminders, [eventId]: !reminders[eventId] };
    setReminders(newReminders);
    localStorage.setItem('eventReminders', JSON.stringify(newReminders));
    
    if (newReminders[eventId]) {
      toast.success('Reminder set successfully');
    } else {
      toast.info('Reminder removed');
    }
  };

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
    <div className="min-h-screen pb-16">
      <TopNavbar />
      
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">My Event Calendar</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  modifiersClassNames={{
                    today: "bg-accent text-accent-foreground",
                    selected: "bg-primary text-primary-foreground",
                  }}
                  modifiers={{
                    dayModifier: (day) => {
                      // Check if any events are on this day
                      const hasEvents = events.some(event => isSameDay(new Date(event.date), day));
                      return hasEvents;
                    }
                  }}
                  modifiersStyles={{
                    dayModifier: { backgroundColor: "rgba(var(--primary), 0.15)", fontWeight: "600" }
                  }}
                />
              </div>
              
              <CategoryLegend />
            </div>
            
            <div className="lg:col-span-5">
              <DailyEvents 
                date={date}
                events={events}
                onEventClick={setSelectedEvent}
              />
            </div>
          </div>
        </motion.div>
      </main>
      
      {selectedEvent && (
        <EventDetailsModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          reminders={reminders}
          toggleReminder={toggleReminder}
        />
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default UserCalendar;
