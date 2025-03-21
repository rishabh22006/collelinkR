
import React from 'react';
import { CalendarDays, Clock, MapPin, User, Users, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CustomBadge from '../ui/CustomBadge';
import { Button } from '@/components/ui/button';
import { Event, useEventRegistration } from '@/hooks/useEvents';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured';
  className?: string;
  onRegister: (eventId: string) => void;
  attendeeCount?: number;
}

const EventCard = ({ 
  event, 
  variant = 'default',
  className,
  onRegister,
  attendeeCount = 0
}: EventCardProps) => {
  const { session } = useAuthStore();
  const navigate = useNavigate();
  const { data: registration, isLoading: registrationLoading } = useEventRegistration(event.id);
  const isRegistered = !!registration;
  const isFeatured = variant === 'featured' || event.is_featured;
  const isOfficial = event.host_id === null; // Official events don't have a host_id
  
  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      toast.error('Authentication required', {
        description: 'Please login to register for events',
        action: {
          label: 'Login',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }
    
    onRegister(event.id);
  };

  const isLive = new Date(event.date) <= new Date() && 
    (!event.end_date || new Date(event.end_date) >= new Date());

  // Different background colors for official vs normal events
  const cardColorClass = isOfficial 
    ? "bg-gradient-to-br from-blue-50 to-violet-50 border-blue-100" 
    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100";
    
  // Different card colors based on category
  const getCategoryStyles = () => {
    const categoryColorMap: Record<string, string> = {
      'Hackathons': isOfficial ? 'bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-200',
      'Workshops': isOfficial ? 'bg-purple-50 border-purple-200' : 'bg-purple-50 border-purple-200',
      'Fests': isOfficial ? 'bg-pink-50 border-pink-200' : 'bg-pink-50 border-pink-200',
      'Social': isOfficial ? 'bg-green-50 border-green-200' : 'bg-green-50 border-green-200',
      'Sports': isOfficial ? 'bg-red-50 border-red-200' : 'bg-red-50 border-red-200',
      'Academic': isOfficial ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-50 border-indigo-200',
    };
    
    const defaultColor = isOfficial 
      ? 'bg-gradient-to-br from-blue-50 to-violet-50 border-blue-100'
      : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100';
    
    return categoryColorMap[event.category] || defaultColor;
  };

  return (
    <div 
      className={cn(
        "group relative rounded-2xl overflow-hidden card-shadow card-hover transition-all duration-300 border",
        getCategoryStyles(),
        isFeatured ? "md:flex md:h-64" : "h-auto",
        className
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden bg-secondary/10",
          isFeatured ? "md:w-1/2 h-48 md:h-full" : "h-48"
        )}
      >
        {event.image_url ? (
          <div 
            className="blur-load w-full h-full" 
            style={{ backgroundImage: `url(${event.image_url}?blur=20)` }}
          >
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={(e) => e.currentTarget.parentElement?.classList.add('loaded')}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <CalendarDays size={48} className={isOfficial ? "text-blue-300" : "text-amber-300"} />
          </div>
        )}
        
        {isLive && (
          <div className="absolute top-3 left-3 z-10">
            <CustomBadge variant="live" size="md">
              <span className="mr-1">●</span> LIVE NOW
            </CustomBadge>
          </div>
        )}
        
        {isOfficial && (
          <div className="absolute top-3 right-3 z-10">
            <CustomBadge variant="primary" size="md">Official</CustomBadge>
          </div>
        )}
        
        {isFeatured && !isOfficial && (
          <div className="absolute top-3 right-3 z-10">
            <CustomBadge variant="default" size="md">Featured</CustomBadge>
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
                variant={isOfficial ? "primary" : "default"} 
                size="sm" 
                className="mb-2"
              >
                {event.category}
              </CustomBadge>
              <h3 className={`text-xl font-semibold tracking-tight mb-1 ${isOfficial ? "text-blue-900" : "text-amber-900"}`}>
                {event.title}
              </h3>
            </div>
          </div>
          
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays size={14} className="mr-2" />
              <span>{format(parseISO(event.date), 'EEEE, MMMM do')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={14} className="mr-2" />
              <span>{format(parseISO(event.date), 'h:mm a')}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-2" />
                <span>{event.location}</span>
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
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button
            size="sm"
            variant={isRegistered ? "secondary" : isOfficial ? "default" : "outline"}
            className={cn(
              "transition-all duration-300",
              isRegistered ? "opacity-70" : "",
              isOfficial && !isRegistered ? "bg-blue-600 hover:bg-blue-700" : "",
              !isOfficial && !isRegistered ? "border-amber-600 text-amber-600 hover:bg-amber-50" : ""
            )}
            onClick={handleRegister}
            disabled={isRegistered || registrationLoading}
          >
            {registrationLoading ? "Loading..." : isRegistered ? "Registered" : "Register"}
          </Button>
          
          <ChevronRight size={18} className="text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
