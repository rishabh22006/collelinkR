
import React from 'react';
import { categoryColors } from '@/utils/calendarUtils';

const CategoryLegend = () => {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold mb-3">Category Legend</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(categoryColors).map(([category, { bg }]) => (
          <div key={category} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${bg}`}></div>
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryLegend;
