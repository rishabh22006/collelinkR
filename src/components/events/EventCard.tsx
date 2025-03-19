
import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, User, Users, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CustomBadge from '../ui/CustomBadge';
import { Button } from '@/components/ui/button';

export interface EventProps {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: string;
  attendees: number;
  organizer: string;
  isLive?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
}

interface EventCardProps {
  event: EventProps;
  variant?: 'default' | 'featured';
  className?: string;
}

const EventCard = ({ 
  event, 
  variant = 'default',
  className
}: EventCardProps) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const isFeatured = variant === 'featured' || event.isFeatured;
  
  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRegistered(true);
    toast.success(`Registered for ${event.title}!`, {
      description: `You'll receive updates about this event.`,
    });
  };

  return (
    <div 
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-card card-shadow card-hover transition-all duration-300",
        isFeatured ? "md:flex md:h-64" : "h-auto",
        className
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden bg-secondary/30",
          isFeatured ? "md:w-1/2 h-48 md:h-full" : "h-48"
        )}
      >
        {event.imageUrl ? (
          <div 
            className="blur-load w-full h-full" 
            style={{ backgroundImage: `url(${event.imageUrl}?blur=20)` }}
          >
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={(e) => e.currentTarget.parentElement?.classList.add('loaded')}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <CalendarDays size={48} className="text-primary/40" />
          </div>
        )}
        
        {event.isLive && (
          <div className="absolute top-3 left-3 z-10">
            <CustomBadge variant="live" size="md">
              <span className="mr-1">●</span> LIVE NOW
            </CustomBadge>
          </div>
        )}
        
        {isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <CustomBadge variant="primary" size="md">Featured</CustomBadge>
          </div>
        )}
      </div>
      
      <div className={cn(
        "p-5 flex flex-col justify-between",
        isFeatured ? "md:w-1/2" : ""
      )}>
        <div>
          <div className="flex items-start justify-between">
            <div>
              <CustomBadge 
                variant="outline" 
                size="sm" 
                className="mb-2"
              >
                {event.category}
              </CustomBadge>
              <h3 className="text-xl font-semibold tracking-tight mb-1">{event.title}</h3>
            </div>
          </div>
          
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays size={14} className="mr-2" />
              <span>{format(event.date, 'EEEE, MMMM do')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={14} className="mr-2" />
              <span>{format(event.date, 'h:mm a')}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin size={14} className="mr-2" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              <span>{event.attendees} attendees</span>
            </div>
            
            <div className="flex items-center">
              <User size={14} className="mr-2" />
              <span>By {event.organizer}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button
            size="sm"
            variant={isRegistered ? "secondary" : "default"}
            className={cn(
              "transition-all duration-300",
              isRegistered ? "opacity-70" : ""
            )}
            onClick={handleRegister}
            disabled={isRegistered}
          >
            {isRegistered ? "Registered" : "Register"}
          </Button>
          
          <ChevronRight size={18} className="text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
