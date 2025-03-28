
import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, School, Globe, FileDown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Event } from '@/hooks/useEvents';
import { useAuthStore } from '@/stores/authStore';
import { useEvents } from '@/hooks/useEvents';

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
  attendeeCount?: number;
}

const EventCard = ({ event, onRegister, isRegistered, attendeeCount = 0 }: EventCardProps) => {
  const { profile } = useAuthStore();
  const { exportAttendeeList } = useEvents();
  
  const isHost = profile?.id === event.host_id;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d, yyyy h:mm a');
  };
  
  const handleExportAttendees = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    exportAttendeeList(event.id, event.title);
  };

  const getHostIcon = () => {
    if (event.host_type === 'club') {
      return <School className="h-4 w-4 mr-1" />;
    } else if (event.host_type === 'community') {
      return <Globe className="h-4 w-4 mr-1" />;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {event.image_url && (
        <div
          className="h-48 bg-center bg-cover"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />
      )}
      
      <CardHeader className={cn(
        "p-4",
        !event.image_url && `bg-${event.category.toLowerCase()}-50`
      )}>
        <div className="flex justify-between">
          <Badge variant={isRegistered ? "secondary" : "outline"}>
            {event.category}
          </Badge>
          
          {event.host_type && (
            <Badge variant="outline" className="flex items-center">
              {getHostIcon()}
              {event.host_type.charAt(0).toUpperCase() + event.host_type.slice(1)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg">{event.title}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{event.location}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {event.host_type?.charAt(0).toUpperCase() || 'H'}
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-2 flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{attendeeCount} attendees</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isHost && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportAttendees}
              className="gap-1"
            >
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          )}
          
          <Button 
            variant={isRegistered ? "secondary" : "default"} 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event.id);
            }}
            disabled={isRegistered}
          >
            {isRegistered ? 'Registered' : 'RSVP'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
