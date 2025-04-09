
import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Communities = () => {
  const navigate = useNavigate();
  
  const { data: communities, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching communities:", error);
        return [];
      }
      
      return data || [];
    }
  });

  const handleCreateCommunity = () => {
    // Navigate to community creation page or open a modal
    // For now we'll just show a placeholder
    console.log("Create community clicked");
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-semibold">Communities</h1>
        </div>
      </header>

      <main className="container py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ))}
          </div>
        ) : communities && communities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {communities.map((community) => (
              <motion.div 
                key={community.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{community.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {/* Display member count when available */}
                      {community.members_count || 0} members
                    </p>
                  </div>
                  <button className="rounded-full bg-primary/10 text-primary p-1.5">
                    <UserPlus size={18} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {community.description || 'No description available'}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground mb-4">No communities have been created yet</p>
          </div>
        )}

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
          <Button onClick={handleCreateCommunity} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            <UserPlus size={18} />
            <span>Create New Community</span>
          </Button>
        </motion.div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Communities;
