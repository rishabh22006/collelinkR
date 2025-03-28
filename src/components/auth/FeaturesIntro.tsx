
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FeatureCard from './FeatureCard';
import { Calendar, UsersRound, Building } from 'lucide-react';

interface FeaturesIntroProps {
  onContinue: () => void;
}

const FeaturesIntro = ({ onContinue }: FeaturesIntroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Welcome to ColleLink
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mt-2"
        >
          Your campus connection hub
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard
          title="Campus Events"
          description="Discover and join exciting events happening around your campus. Never miss out on important opportunities."
          icon={<Calendar className="w-6 h-6" />}
          delay={0.2}
        />
        <FeatureCard
          title="Clubs & Activities"
          description="Find and join clubs that match your interests. Connect with like-minded students."
          icon={<UsersRound className="w-6 h-6" />}
          delay={0.3}
        />
        <FeatureCard
          title="Community Building"
          description="Create and grow your own communities. Foster connections that last beyond graduation."
          icon={<Building className="w-6 h-6" />}
          delay={0.4}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button onClick={onContinue} size="lg">
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FeaturesIntro;
