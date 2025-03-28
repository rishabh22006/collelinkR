
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, className, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <Card className={cn("h-full border-2 hover:border-primary/50 transition-colors", className)}>
        <CardHeader className="pb-2">
          <div className="mb-3 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
