
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parse, startOfWeek, getDay, addDays, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventAttendee } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

interface EventWithAttendance extends Event {
  attendance?: EventAttendee;
}

const UserCalendar = () => {
  const { session, profile } = useAuthStore();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
        const eventsWithAttendance = eventsData.map(event => {
          const attendance = attendances.find(a => a.event_id === event.id);
          return {
            ...event,
            attendance
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

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

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

  // Get color based on event category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      'Hackathons': { bg: 'bg-blue-500', text: 'text-white' },
      'Workshops': { bg: 'bg-amber-500', text: 'text-white' },
      'Fests': { bg: 'bg-purple-500', text: 'text-white' },
      'Social': { bg: 'bg-green-500', text: 'text-white' },
      'Sports': { bg: 'bg-red-500', text: 'text-white' },
      'Academic': { bg: 'bg-indigo-500', text: 'text-white' },
    };
    
    return colors[category] || { bg: 'bg-gray-500', text: 'text-white' };
  };

  // Format the date for display
  const formatEventTime = (dateStr: string) => {
    return format(new Date(dateStr), 'h:mm a');
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
                  modifiersFn={{
                    dayModifier: (day) => ({
                      className: getDayClassNames(day),
                    }),
                  }}
                />
              </div>
              
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <h2 className="font-semibold mb-3">Category Legend</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Hackathons', 'Workshops', 'Fests', 'Social', 'Sports', 'Academic'].map(category => {
                    const { bg, text } = getCategoryColor(category);
                    return (
                      <div key={category} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${bg}`}></div>
                        <span className="text-sm">{category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{format(date, 'MMMM d, yyyy')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {getEventsForDate(date).length} events scheduled
                  </p>
                </div>
                
                <div className="divide-y">
                  {loadingEvents ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Loading your events...</p>
                    </div>
                  ) : getEventsForDate(date).length > 0 ? (
                    getEventsForDate(date).map(event => {
                      const { bg, text } = getCategoryColor(event.category);
                      return (
                        <div 
                          key={event.id}
                          className="p-4 hover:bg-secondary/10 cursor-pointer transition-colors"
                          onClick={() => setSelectedEvent(event)}
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
            </div>
          </div>
        </motion.div>
      </main>
      
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto"
          >
            <div className="sticky top-0 bg-card border-b p-4 flex justify-between items-center">
              <h2 className="font-semibold">Event Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                ✕
              </Button>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <Badge className={`${getCategoryColor(selectedEvent.category).bg} ${getCategoryColor(selectedEvent.category).text}`}>
                    {selectedEvent.category}
                  </Badge>
                  <div className="flex items-center">
                    <Bell size={14} className="mr-1 text-muted-foreground" />
                    <Switch 
                      checked={!!reminders[selectedEvent.id]} 
                      onCheckedChange={() => toggleReminder(selectedEvent.id)}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {selectedEvent.description || 'No description available'}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarIcon size={16} className="mr-2 text-primary" />
                    <span>{format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-primary" />
                    <span>{formatEventTime(selectedEvent.date)}</span>
                    {selectedEvent.end_date && (
                      <span> - {formatEventTime(selectedEvent.end_date)}</span>
                    )}
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-primary" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedEvent.image_url && (
                <div className="mb-6">
                  <img 
                    src={selectedEvent.image_url} 
                    alt={selectedEvent.title} 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex space-x-2 pt-2 border-t">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    // Generate calendar file (basic implementation)
                    const eventStart = new Date(selectedEvent.date);
                    const eventEnd = selectedEvent.end_date 
                      ? new Date(selectedEvent.end_date) 
                      : new Date(eventStart.getTime() + 60*60*1000); // 1 hour default
                      
                    const icsContent = [
                      'BEGIN:VCALENDAR',
                      'VERSION:2.0',
                      'BEGIN:VEVENT',
                      `SUMMARY:${selectedEvent.title}`,
                      `LOCATION:${selectedEvent.location || ''}`,
                      `DESCRIPTION:${selectedEvent.description || ''}`,
                      `DTSTART:${format(eventStart, 'yyyyMMdd\'T\'HHmmss')}`,
                      `DTEND:${format(eventEnd, 'yyyyMMdd\'T\'HHmmss')}`,
                      'END:VEVENT',
                      'END:VCALENDAR'
                    ].join('\n');
                    
                    const blob = new Blob([icsContent], {type: 'text/calendar'});
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedEvent.title.replace(/\s+/g, '-')}.ics`;
                    link.click();
                    
                    toast.success('Calendar event downloaded');
                  }}
                >
                  Add to Calendar
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default UserCalendar;
