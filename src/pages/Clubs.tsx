
import React from 'react';
import { motion } from 'framer-motion';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';

const Clubs = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <div className="container py-4 mb-20">
        <h1 className="text-2xl font-semibold mb-6">Clubs & Communities</h1>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Club functionality has been removed.
          </p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Clubs;
