
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <AlertTriangle size={32} className="text-primary" />
      </motion.div>
      
      <motion.h1 
        className="text-5xl font-bold mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        404
      </motion.h1>
      
      <motion.p 
        className="text-xl text-muted-foreground mb-8 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button asChild size="lg">
          <a href="/">Return to Home</a>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
