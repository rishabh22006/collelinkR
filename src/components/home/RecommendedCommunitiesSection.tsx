
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import RecommendedCommunityCard from './RecommendedCommunityCard';

interface RecommendedCommunitiesSectionProps {
  itemVariants: any;
}

const renderCommunitySkeleton = () => (
  <div className="p-4 rounded-lg border border-border">
    <Skeleton className="h-6 w-3/4 mb-1" />
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-8 w-16 rounded" />
  </div>
);

const RecommendedCommunitiesSection = ({ itemVariants }: RecommendedCommunitiesSectionProps) => {
  const { data: recommendedCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ['communities', 'recommended'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }
      
      return data;
    }
  });
  
  return (
    <motion.section variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended Communities</h2>
        <Link to="/communities" className="text-sm text-primary">View all</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {loadingCommunities ? (
          <>
            {renderCommunitySkeleton()}
            {renderCommunitySkeleton()}
            {renderCommunitySkeleton()}
          </>
        ) : recommendedCommunities.length > 0 ? (
          recommendedCommunities.map(community => (
            <RecommendedCommunityCard key={community.id} community={community} />
          ))
        ) : (
          <div className="col-span-full text-center py-6 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-3">No communities found</p>
            <Link to="/communities">
              <Button size="sm" variant="outline">Create a Community</Button>
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default RecommendedCommunitiesSection;
