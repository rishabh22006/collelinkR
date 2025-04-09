
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { useAuthStore } from '@/stores/authStore';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import EventList from '@/components/events/EventList';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import RecommendedCommunitiesSection from '@/components/home/RecommendedCommunitiesSection';

const Index = () => {
  const { session, profile } = useAuthStore();
  const headerRef = useScrollAnimation<HTMLHeadingElement>('scale');
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>('fade', 0.2, 200);
  
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

        <UpcomingEventsSection itemVariants={itemVariants} />
        <RecommendedCommunitiesSection itemVariants={itemVariants} />

        <motion.section variants={itemVariants}>
          <EventList />
        </motion.section>
      </motion.main>

      <BottomNavbar />
    </div>
  );
};

export default Index;
