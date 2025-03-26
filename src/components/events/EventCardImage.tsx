
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardImageProps {
  imageUrl?: string | null;
  title: string;
  isOfficial?: boolean;
  isFeatured?: boolean;
}

const EventCardImage = ({ imageUrl, title, isOfficial = false, isFeatured = false }: EventCardImageProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-secondary/10",
        isFeatured ? "md:w-1/2 h-48 md:h-full" : "h-48"
      )}
    >
      {imageUrl ? (
        <div 
          className="blur-load w-full h-full" 
          style={{ backgroundImage: `url(${imageUrl}?blur=20)` }}
        >
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={(e) => e.currentTarget.parentElement?.classList.add('loaded')}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/5">
          <CalendarDays size={48} className={isOfficial ? "text-blue-300" : "text-amber-300"} />
        </div>
      )}
    </div>
  );
};

export default EventCardImage;
