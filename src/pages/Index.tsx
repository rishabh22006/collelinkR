
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

const Index = () => {
  const { session, profile } = useAuthStore();
  const headerRef = useScrollAnimation<HTMLHeadingElement>('scale');
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>('fade', 0.2, 200);
  
  // Sample data for recommended communities
  const recommendedCommunities = [
    { id: 1, name: "Photography Club", members: 154 },
    { id: 2, name: "Debate Society", members: 88 },
    { id: 3, name: "AI & ML Research", members: 102 },
  ];

  // Sample upcoming events
  const upcomingEvents = [
    { 
      id: 1, 
      title: "Campus Hackathon", 
      date: "May 25, 2023",
      time: "9:00 AM - 6:00 PM", 
      location: "Engineering Building",
      attendees: 78
    },
    { 
      id: 2, 
      title: "Career Fair", 
      date: "May 30, 2023",
      time: "10:00 AM - 3:00 PM", 
      location: "Student Center",
      attendees: 120
    },
  ];
  
  useEffect(() => {
    // When component mounts, apply a fade-in animation to the body
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
          <h1 ref={headerRef} className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Welcome to ColleLink</h1>
          <p ref={descriptionRef} className="text-muted-foreground text-base max-w-2xl mx-auto">
            Discover events, connect with peers, and build your college community at MIT ADT University.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Link to="/search" className="text-sm text-primary">View all</Link>
          </div>
          <div className="grid gap-3">
            {upcomingEvents.map(event => (
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
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={14} className="mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={14} className="mr-2" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">View Details</Button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Communities</h2>
            <Link to="/communities" className="text-sm text-primary">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedCommunities.map(community => (
              <motion.div 
                key={community.id}
                className="p-4 rounded-lg border border-border hover:bg-card/50 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <h3 className="font-medium">{community.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{community.members} members</p>
                <Button variant="ghost" size="sm" className="mt-2">Join</Button>
              </motion.div>
            ))}
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
