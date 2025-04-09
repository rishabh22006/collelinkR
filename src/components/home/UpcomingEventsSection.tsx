
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UpcomingEventCard from './UpcomingEventCard';

interface UpcomingEventsSectionProps {
  itemVariants: any;
}

const renderEventSkeleton = () => (
  <div className="p-4 rounded-lg border border-border">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center text-sm">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center text-sm">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center text-sm">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
    <Skeleton className="h-9 w-full mt-3 rounded" />
  </div>
);

const UpcomingEventsSection = ({ itemVariants }: UpcomingEventsSectionProps) => {
  const { data: upcomingEvents = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(2);
      
      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      const eventsWithAttendees = await Promise.all((data || []).map(async event => {
        const { count, error: countError } = await supabase
          .from('event_attendees')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id);

        if (countError) {
          console.error('Error counting attendees:', countError);
          return { ...event, attendee_count: 0 };
        }

        return { ...event, attendee_count: count || 0 };
      }));
      
      return eventsWithAttendees;
    }
  });

  return (
    <motion.section variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <Link to="/events" className="text-sm text-primary">View all</Link>
      </div>
      
      <div className="grid gap-3">
        {loadingEvents ? (
          <>
            {renderEventSkeleton()}
            {renderEventSkeleton()}
          </>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <UpcomingEventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="text-center py-6 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-3">No upcoming events found</p>
            <Link to="/events">
              <Button size="sm" variant="outline">Host an Event</Button>
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default UpcomingEventsSection;
