
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import EventList from '@/components/events/EventList';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

const Index = () => {
  const { session, profile, signOut } = useAuthStore();

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
            {session ? (
              <div className="flex items-center gap-3">
                <div className="text-sm hidden md:block">
                  <span className="text-muted-foreground">Hello, </span>
                  <span className="font-medium">{profile?.display_name || 'User'}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-1" /> 
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth?tab=signup">
                    <UserPlus className="w-4 h-4 mr-1" /> 
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
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
          <h1 className="text-3xl font-bold mb-2">Welcome to ColleLink</h1>
          <p className="text-muted-foreground">Discover events, connect with peers, and build your college community.</p>
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
