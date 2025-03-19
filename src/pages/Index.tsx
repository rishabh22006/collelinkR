
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/shared/Logo';
import EventList from '@/components/events/EventList';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { mockEvents } from '@/utils/mockData';

const Index = () => {
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
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <button className="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <motion.main 
        className="container py-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Welcome to Campuscore</h1>
          <p className="text-muted-foreground">Discover events, connect with peers, and build your college community.</p>
        </motion.section>

        <motion.section variants={itemVariants}>
          <EventList events={mockEvents} />
        </motion.section>
      </motion.main>

      <BottomNavbar />
    </div>
  );
};

export default Index;
