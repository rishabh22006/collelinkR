
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

const CreateCommunityCard = () => (
  <motion.div 
    className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="p-4 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <PlusCircle className="text-primary" size={24} />
      </div>
      <h3 className="font-medium text-base mb-1 text-foreground">Create New Community</h3>
      <p className="text-sm text-muted-foreground mb-3">Connect with peers</p>
      <Button 
        variant="default" 
        size="sm"
        className="w-full"
      >
        Create
      </Button>
    </div>
  </motion.div>
);

export default CreateCommunityCard;
