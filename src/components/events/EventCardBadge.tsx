
import React from 'react';
import CustomBadge from '../ui/CustomBadge';

interface EventCardBadgeProps {
  isLive?: boolean;
  isOfficial?: boolean;
  isFeatured?: boolean;
  category?: string;
}

const EventCardBadge = ({ isLive, isOfficial, isFeatured, category }: EventCardBadgeProps) => {
  if (isLive) {
    return (
      <div className="absolute top-3 left-3 z-10">
        <CustomBadge variant="live" size="md">
          <span className="mr-1">●</span> LIVE NOW
        </CustomBadge>
      </div>
    );
  }

  if (isOfficial) {
    return (
      <div className="absolute top-3 right-3 z-10">
        <CustomBadge variant="primary" size="md">Official</CustomBadge>
      </div>
    );
  }

  if (isFeatured) {
    return (
      <div className="absolute top-3 right-3 z-10">
        <CustomBadge variant="default" size="md">Featured</CustomBadge>
      </div>
    );
  }

  if (category) {
    return (
      <CustomBadge 
        variant="default" 
        size="sm" 
        className="mb-2"
      >
        {category}
      </CustomBadge>
    );
  }

  return null;
};

export default EventCardBadge;
