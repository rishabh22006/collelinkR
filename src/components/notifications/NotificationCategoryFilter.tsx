
import React from 'react';
import { Button } from '@/components/ui/button';
import { NotificationCategory } from '@/types/notifications';

interface NotificationCategoryFilterProps {
  selectedCategory: NotificationCategory;
  onCategoryChange: (category: NotificationCategory) => void;
  unreadCounts: Record<NotificationCategory, number>;
}

const NotificationCategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  unreadCounts,
}: NotificationCategoryFilterProps) => {
  const categories: { value: NotificationCategory; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'messages', label: 'Messages' },
    { value: 'events', label: 'Events' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'communities', label: 'Communities' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className="relative"
        >
          {category.label}
          {unreadCounts[category.value] > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCounts[category.value]}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default NotificationCategoryFilter;
