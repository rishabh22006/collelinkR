
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import EventList from '@/components/events/EventList';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const Index = () => {
  const { session, profile, signOut } = useAuthStore();
  const headerRef = useScrollAnimation<HTMLHeadingElement>('scale');
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>('fade', 0.2, 200);
  
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
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/30">
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
        <motion.section variants={itemVariants} className="text-center py-8">
          <h1 ref={headerRef} className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Welcome to ColleLink</h1>
          <p ref={descriptionRef} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover events, connect with peers, and build your college community at MIT ADT University.
          </p>
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
