
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import CommunityDetailView from './CommunityDetailView';

interface CommunityProps {
  id: number | string;
  name: string;
  institution?: string;
  members_count?: number;
  members?: number;  // For backward compatibility
  description?: string;
  isJoined?: boolean;
  isFeatured?: boolean;
  image?: string;
}

const CommunityCard = ({ community }: { community: any }) => {
  const [isJoined, setIsJoined] = useState(community.isJoined || false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const logoPlaceholder = community.name.charAt(0);
  
  // Calculate member count from available properties
  const memberCount = community.members_count ?? 
                     community.member_count ?? 
                     (community.members || 0);

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
            {community.logo_url ? (
              <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
            )}
          </div>
          <h3 className="font-medium text-base mb-1 text-foreground">{community.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{community.institution || ''}</p>
          <p className="text-xs text-muted-foreground mb-3">{memberCount} members</p>
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

      <CommunityDetailView 
        communityId={community.id.toString()}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onJoinToggle={handleJoinToggle}
        isJoined={isJoined}
      />
    </>
  );
};

export default CommunityCard;
