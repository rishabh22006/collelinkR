
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CommunityDataProps } from '@/data/clubsData';

const CommunityCard = ({ community }: { community: CommunityDataProps }) => {
  const [isJoined, setIsJoined] = useState(community.isJoined);
  const logoPlaceholder = community.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
          {community.image ? (
            <img src={community.image} alt={community.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
          )}
        </div>
        <h3 className="font-medium text-base mb-1 text-foreground">{community.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">{community.institution}</p>
        <p className="text-xs text-muted-foreground mb-3">{community.members} members</p>
        <Button 
          variant={isJoined ? "secondary" : "default"} 
          size="sm"
          className="w-full"
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
