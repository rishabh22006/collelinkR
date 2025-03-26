
import React from 'react';
import { CalendarDays, Clock, MapPin, User, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventCardMetaProps {
  date: string;
  location?: string | null;
  attendeeCount?: number;
  isOfficial?: boolean;
}

const EventCardMeta = ({ date, location, attendeeCount = 0, isOfficial = false }: EventCardMetaProps) => {
  return (
    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
      <div className="flex items-center">
        <CalendarDays size={14} className="mr-2" />
        <span>{format(parseISO(date), 'EEEE, MMMM do')}</span>
      </div>
      
      <div className="flex items-center">
        <Clock size={14} className="mr-2" />
        <span>{format(parseISO(date), 'h:mm a')}</span>
      </div>
      
      {location && (
        <div className="flex items-center">
          <MapPin size={14} className="mr-2" />
          <span>{location}</span>
        </div>
      )}
      
      <div className="flex items-center">
        <Users size={14} className="mr-2" />
        <span>{attendeeCount} attendees</span>
      </div>
      
      <div className="flex items-center">
        <User size={14} className="mr-2" />
        <span>By {isOfficial ? 'ColleLink' : 'Student Club'}</span>
      </div>
    </div>
  );
};

export default EventCardMeta;
