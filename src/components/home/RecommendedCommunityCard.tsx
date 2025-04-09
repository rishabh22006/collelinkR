
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getMemberCount } from '@/utils/dataUtils';

interface RecommendedCommunityCardProps {
  community: any;
}

const RecommendedCommunityCard = ({ community }: RecommendedCommunityCardProps) => {
  return (
    <motion.div 
      className="p-4 rounded-lg border border-border hover:bg-card/50 transition-colors"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <h3 className="font-medium">{community.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {getMemberCount(community)} members
      </p>
      <Button variant="ghost" size="sm" className="mt-2">Join</Button>
    </motion.div>
  );
};

export default RecommendedCommunityCard;
