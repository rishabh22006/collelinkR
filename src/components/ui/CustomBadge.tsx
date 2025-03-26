
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'live';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const CustomBadge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-accent bg-transparent text-foreground',
    live: 'bg-accent text-accent-foreground animate-pulse-soft',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full',
    md: 'text-xs px-2.5 py-0.5 rounded-full',
    lg: 'text-sm px-3 py-1 rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium transition-all duration-300 hover:scale-[1.05]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default CustomBadge;
