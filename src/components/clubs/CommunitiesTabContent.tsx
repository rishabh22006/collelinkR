
import React from 'react';
import { motion } from 'framer-motion';
import CommunityCard from '@/components/clubs/CommunityCard';
import CreateCommunityCard from '@/components/clubs/CreateCommunityCard';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunitiesTabContentProps {
  isLoading: boolean;
  filteredCommunities: any[];
  renderSkeletons: (count: number) => React.ReactNode;
  containerVariants: any;
  itemVariants: any;
}

const CommunitiesTabContent = ({
  isLoading,
  filteredCommunities,
  renderSkeletons,
  containerVariants,
  itemVariants
}: CommunitiesTabContentProps) => {
  return (
    isLoading ? (
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderSkeletons(7)}
      </motion.div>
    ) : (
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCommunities
          .filter(community => !community.is_featured)
          .map((community) => (
          <motion.div key={community.id} variants={itemVariants}>
            <CommunityCard community={community} />
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <CreateCommunityCard />
        </motion.div>
        
        {filteredCommunities.length === 0 && (
          <motion.div variants={itemVariants} className="col-span-full py-8">
            <p className="text-center text-muted-foreground">
              No communities found. Create the first one!
            </p>
          </motion.div>
        )}
      </motion.div>
    )
  );
};

export default CommunitiesTabContent;
