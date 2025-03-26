
import React from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Event, useEventRegistration } from '@/hooks/useEvents';
import EventCardBadge from './EventCardBadge';
import EventCardImage from './EventCardImage';
import EventCardMeta from './EventCardMeta';
import EventCardActions from './EventCardActions';
import CustomBadge from '../ui/CustomBadge';

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
      <EventCardImage 
        imageUrl={event.image_url} 
        title={event.title}
        isOfficial={isOfficial}
        isFeatured={isFeatured}
      />
      
      {isLive && <EventCardBadge isLive={true} />}
      {isOfficial && <EventCardBadge isOfficial={true} />}
      {isFeatured && !isOfficial && <EventCardBadge isFeatured={true} />}
      
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
          
          <EventCardMeta 
            date={event.date}
            location={event.location}
            attendeeCount={attendeeCount}
            isOfficial={isOfficial}
          />
        </div>
        
        <EventCardActions 
          isRegistered={isRegistered}
          isLoading={registrationLoading}
          isOfficial={isOfficial}
          onRegister={handleRegister}
        />
      </div>
    </div>
  );
};

export default EventCard;
