import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Calendar, MapPin, Clock, Users } from 'lucide-react';
import EventList from '@/components/events/EventList';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { session, profile } = useAuthStore();
  const headerRef = useScrollAnimation<HTMLHeadingElement>('scale');
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>('fade', 0.2, 200);
  
  const { data: recommendedCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ['communities', 'recommended'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }
      
      return data;
    }
  });
  
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
  
  useEffect(() => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.5s ease-in-out';
    }, 100);

    return () => {
      document.body.style.opacity = '';
      document.body.style.transition = '';
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };
  
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
  
  const renderCommunitySkeleton = () => (
    <div className="p-4 rounded-lg border border-border">
      <Skeleton className="h-6 w-3/4 mb-1" />
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/10">
      <TopNavbar />
      
      <motion.main 
        className="container py-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section variants={itemVariants} className="text-center py-4">
          <h1 ref={headerRef} className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to ColleLink
          </h1>
          <p ref={descriptionRef} className="text-muted-foreground text-base max-w-2xl mx-auto">
            Discover events, connect with peers, and build your college community at MIT ADT University.
          </p>
        </motion.section>

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
                <motion.div 
                  key={event.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={14} className="mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={14} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={14} className="mr-2" />
                      <span>
                        {event.attendee_count || 0} attending
                      </span>
                    </div>
                  </div>
                  <Link to={`/events/${event.id}`}>
                    <Button variant="outline" size="sm" className="mt-3 w-full">View Details</Button>
                  </Link>
                </motion.div>
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

        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Communities</h2>
            <Link to="/communities" className="text-sm text-primary">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {loadingCommunities ? (
              <>
                {renderCommunitySkeleton()}
                {renderCommunitySkeleton()}
                {renderCommunitySkeleton()}
              </>
            ) : recommendedCommunities.length > 0 ? (
              recommendedCommunities.map(community => (
                <motion.div 
                  key={community.id}
                  className="p-4 rounded-lg border border-border hover:bg-card/50 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <h3 className="font-medium">{community.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {community.members_count || community.member_count || 0} members
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2">Join</Button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-3">No communities found</p>
                <Link to="/communities">
                  <Button size="sm" variant="outline">Create a Community</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <EventList />
        </motion.section>
      </motion.main>

      <BottomNavbar />
    </div>
  );
};

export default Index;
