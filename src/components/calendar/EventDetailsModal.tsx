
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Bell, CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Event } from '@/hooks/useEvents';
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

interface EventDetailsModalProps {
  selectedEvent: EventWithAttendance;
  setSelectedEvent: (event: EventWithAttendance | null) => void;
  reminders: Record<string, boolean>;
  toggleReminder: (eventId: string) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  selectedEvent,
  setSelectedEvent,
  reminders,
  toggleReminder
}) => {
  // Format the event time for display
  const formatEventTime = (dateStr: string) => {
    return format(new Date(dateStr), 'h:mm a');
  };

  return (
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
  );
};

export default EventDetailsModal;
