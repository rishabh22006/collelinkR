
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Users, Star } from 'lucide-react';
import { ClubDataProps } from '@/data/clubsData';

const FeaturedClubCard = ({ club }: { club: ClubDataProps }) => {
  const [isJoined, setIsJoined] = useState(club.isJoined);
  const logoPlaceholder = club.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
          {club.image ? (
            <img src={club.image} alt={club.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground">{club.name}</h3>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{club.institution}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs py-0">
              <Users className="h-3 w-3 mr-1" />
              {club.members} members
            </Badge>
            <Badge variant="outline" className="text-xs py-0">
              {club.category}
            </Badge>
          </div>
        </div>
        <Button 
          variant={isJoined ? "secondary" : "default"} 
          size="sm"
          className="shrink-0"
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );
};

export default FeaturedClubCard;
