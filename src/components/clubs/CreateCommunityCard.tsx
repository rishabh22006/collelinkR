
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CreateCommunityCard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "You must be logged in to create a community",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/register-community');
  };
  
  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-border"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-sm">
          <PlusCircle className="text-primary" size={28} />
        </div>
        <h3 className="font-medium text-lg mb-2 text-foreground">Create New Community</h3>
        <p className="text-sm text-muted-foreground mb-4">Build and grow your own interest group</p>
        <Button 
          variant="default" 
          size="sm"
          className="w-full font-medium"
          onClick={handleClick}
        >
          Create Now
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateCommunityCard;
