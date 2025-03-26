
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ClubDataProps } from '@/data/clubsData';

const ClubCard = ({ club }: { club: ClubDataProps }) => {
  const [isJoined, setIsJoined] = useState(club.isJoined);
  const logoPlaceholder = club.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
          {club.image ? (
            <img src={club.image} alt={club.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
          )}
        </div>
        <h3 className="font-medium text-base mb-1 text-foreground">{club.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{club.institution}</p>
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

export default ClubCard;
