
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventCardActionsProps {
  isRegistered: boolean;
  isLoading: boolean;
  isOfficial: boolean;
  onRegister: (e: React.MouseEvent) => void;
}

const EventCardActions = ({ 
  isRegistered, 
  isLoading, 
  isOfficial,
  onRegister 
}: EventCardActionsProps) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Button
        size="sm"
        variant={isRegistered ? "secondary" : isOfficial ? "default" : "outline"}
        className={cn(
          "transition-all duration-300",
          isRegistered ? "opacity-70" : "",
          isOfficial && !isRegistered ? "bg-primary hover:bg-accent shadow-[0_0_10px_rgba(255,193,7,0.2)]" : "",
          !isOfficial && !isRegistered ? "border-primary text-primary hover:bg-primary/10" : ""
        )}
        onClick={onRegister}
        disabled={isRegistered || isLoading}
      >
        {isLoading ? "Loading..." : isRegistered ? "Registered" : "Register"}
      </Button>
      
      <ChevronRight size={18} className="text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
    </div>
  );
};

export default EventCardActions;
