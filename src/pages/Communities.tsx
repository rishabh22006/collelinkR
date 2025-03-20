
import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';

const Communities = () => {
  // Sample community data
  const sampleCommunities = [
    { id: 1, name: "Computer Science Club", members: 245, description: "For CS enthusiasts to collaborate and learn together." },
    { id: 2, name: "Engineering Society", members: 187, description: "Connect with fellow engineering students and professionals." },
    { id: 3, name: "Arts & Culture", members: 156, description: "Discuss art, literature and cultural events around campus." },
    { id: 4, name: "Sports Club", members: 320, description: "Join teams, find workout partners, and discuss sports." },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Communities</h1>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {sampleCommunities.map((community) => (
            <motion.div 
              key={community.id}
              className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{community.name}</h3>
                  <p className="text-muted-foreground text-sm">{community.members} members</p>
                </div>
                <button className="rounded-full bg-primary/10 text-primary p-1.5">
                  <UserPlus size={18} />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{community.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex flex-col items-center justify-center py-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Discover More Communities</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect with peers, join communities, and expand your campus connections.
          </p>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            <UserPlus size={18} />
            <span>Create New Community</span>
          </button>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Communities;
