
import React from 'react';
import { motion } from 'framer-motion';
import BottomNavbar from '@/components/layout/BottomNavbar';

const Communities = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Communities</h1>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            Community functionality has been removed.
          </p>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Communities;
