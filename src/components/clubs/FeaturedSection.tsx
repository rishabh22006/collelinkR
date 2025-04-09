
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import FeaturedClubCard from '@/components/clubs/FeaturedClubCard';

interface FeaturedSectionProps {
  activeTab: string;
  featuredClubs: any[];
  featuredCommunities: any[];
  containerVariants: any;
  itemVariants: any;
  transformClubForFeatured: (club: any) => any;
  transformCommunityForFeatured: (community: any) => any;
}

const FeaturedSection = ({
  activeTab,
  featuredClubs,
  featuredCommunities,
  containerVariants,
  itemVariants,
  transformClubForFeatured,
  transformCommunityForFeatured
}: FeaturedSectionProps) => {
  if (featuredClubs.length === 0 && featuredCommunities.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        Featured
      </h2>
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === "clubs" && featuredClubs.map((club) => (
          <motion.div key={club.id} variants={itemVariants}>
            <FeaturedClubCard club={transformClubForFeatured(club)} />
          </motion.div>
        ))}
        
        {activeTab === "communities" && featuredCommunities.map((community) => (
          <motion.div key={community.id} variants={itemVariants}>
            <FeaturedClubCard club={transformCommunityForFeatured(community)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedSection;
