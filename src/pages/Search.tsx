
import React from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users, User, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/CustomBadge';

const Search = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Search</h1>
        </div>
      </header>

      <motion.main 
        className="container py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search people, clubs, communities..." 
            className="pl-10 py-6 rounded-xl"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">FILTER BY</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <User size={14} className="mr-1" /> People
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Users size={14} className="mr-1" /> Clubs
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <UserPlus size={14} className="mr-1" /> Communities
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 text-center">
          <p className="text-muted-foreground">Search for people, clubs, or communities to connect with.</p>
        </motion.div>
      </motion.main>

      <BottomNavbar />
    </div>
  );
};

export default Search;
