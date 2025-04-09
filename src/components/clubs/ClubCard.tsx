
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import ClubDetailView from './ClubDetailView';

interface ClubProps {
  id: number | string;
  name: string;
  institution?: string;
  category?: string;
  image?: string;
  isJoined?: boolean;
  isFeatured?: boolean;
  members?: number;
  description?: string;
}

const ClubCard = ({ club }: { club: ClubProps }) => {
  const [isJoined, setIsJoined] = useState(club.isJoined || false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const logoPlaceholder = club.name.charAt(0);

  const handleJoinToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsJoined(!isJoined);
  };

  return (
    <>
      <motion.div 
        className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border cursor-pointer"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDetailOpen(true)}
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
          <p className="text-sm text-muted-foreground mb-3">{club.institution || ''}</p>
          <Button 
            variant={isJoined ? "secondary" : "default"} 
            size="sm"
            className="w-full"
            onClick={handleJoinToggle}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
        </div>
      </motion.div>

      <ClubDetailView 
        clubId={club.id.toString()}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onJoinToggle={handleJoinToggle}
        isJoined={isJoined}
      />
    </>
  );
};

export default ClubCard;
