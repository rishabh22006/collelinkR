
import React from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, Users } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';

const Connections = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Connections</h1>
        </div>
      </header>

      <main className="container py-6">
        <motion.div 
          className="flex flex-col items-center justify-center py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Grow Your Network</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect with peers, join communities, and expand your campus connections.
          </p>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            <UserPlus size={18} />
            <span>Find Connections</span>
          </button>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Connections;
