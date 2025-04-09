
import React from 'react';
import { motion } from 'framer-motion';
import ClubCard from '@/components/clubs/ClubCard';
import RegisterClubCard from '@/components/clubs/RegisterClubCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ClubsTabContentProps {
  isLoading: boolean;
  filteredClubs: any[];
  renderSkeletons: (count: number) => React.ReactNode;
  containerVariants: any;
  itemVariants: any;
}

const ClubsTabContent = ({
  isLoading,
  filteredClubs,
  renderSkeletons,
  containerVariants,
  itemVariants
}: ClubsTabContentProps) => {
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
        <motion.div variants={itemVariants}>
          <RegisterClubCard />
        </motion.div>
        
        {filteredClubs
          .filter(club => !club.is_featured)
          .map((club) => (
          <motion.div key={club.id} variants={itemVariants}>
            <ClubCard club={club} />
          </motion.div>
        ))}
        
        {filteredClubs.length === 0 && (
          <motion.div variants={itemVariants} className="col-span-full py-8">
            <p className="text-center text-muted-foreground">
              No clubs found. Create the first one!
            </p>
          </motion.div>
        )}
      </motion.div>
    )
  );
};

export default ClubsTabContent;
