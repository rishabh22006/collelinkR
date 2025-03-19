
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn("font-semibold flex items-center", sizeClasses[size], className)}>
      <div className="relative">
        <span className="text-primary">C</span>
        <span className="text-accent absolute -top-0.5 left-[0.4em] transform -rotate-12">C</span>
      </div>
      <span className="ml-1">Campuscore</span>
    </div>
  );
};

export default Logo;
