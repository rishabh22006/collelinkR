
import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Event } from '@/types/events';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
  attendeeCount?: number;
}

const EventCard = ({ event, onRegister, isRegistered, attendeeCount = 0 }: EventCardProps) => {
  const { profile } = useAuthStore();
  
  const cardBgColor = event.metadata?.cardColor || 'bg-card';
  const cardTextColor = event.metadata?.textColor || '';
  const isOnline = event.metadata?.isOnline;
  const onlineLink = event.metadata?.onlineLink;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d, yyyy h:mm a');
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (onlineLink) {
      window.open(onlineLink, '_blank');
    }
  };

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profile) {
      toast.error("Please sign in to register for events");
      return;
    }
    
    onRegister(event.id);
  };

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
      cardBgColor,
      cardTextColor
    )}>
      {event.image_url && (
        <div
          className="h-48 bg-center bg-cover"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />
      )}
      
      <CardHeader className={cn(
        "p-4",
        !event.image_url && cardBgColor
      )}>
        <div className="flex justify-between">
          <Badge variant={isRegistered ? "secondary" : "outline"} className="bg-background/80">
            {event.category}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg">{event.title}</h3>
        
        <div className="flex items-center text-sm text-opacity-80 gap-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-opacity-80">
          {isOnline ? (
            <>
              <LinkIcon className="h-4 w-4 mr-1" />
              <button 
                onClick={handleLinkClick}
                className="underline hover:text-primary transition-colors"
              >
                Online Event (Join Link)
              </button>
            </>
          ) : event.location ? (
            <>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </>
          ) : null}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {event.description && (
          <p className="text-sm text-opacity-80 line-clamp-3">
            {event.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center text-sm text-opacity-80">
            <Users className="h-4 w-4 mr-1" />
            <span>{attendeeCount} attendees</span>
          </div>
        </div>
        
        <Button 
          variant={isRegistered ? "secondary" : "default"} 
          size="sm"
          onClick={handleRSVP}
          disabled={isRegistered}
          className="bg-background/80 text-foreground hover:bg-background"
        >
          {isRegistered ? 'Registered' : 'RSVP'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
