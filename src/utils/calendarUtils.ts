
import { format, isSameDay, isToday } from 'date-fns';

// Function to convert events to calendar-friendly format
export const mapEventsToCalendarFormat = (events: any[]) => {
  return events.map(event => ({
    date: new Date(event.date),
    title: event.title,
    category: event.category
  }));
};

// Get events for a selected date
export const getEventsForDate = (events: any[], date: Date | undefined) => {
  if (!date) return [];
  return events.filter(event => 
    isSameDay(new Date(event.date), date)
  );
};

// Format the event time for display
export const formatEventTime = (dateStr: string) => {
  return format(new Date(dateStr), 'h:mm a');
};

// Categorize events by type
export const categorizeEvents = (selectedDateEvents: any[]) => {
  const categories: Record<string, any[]> = {
    Hackathons: [],
    Workshops: [],
    Fests: [],
    Social: [],
    Sports: [],
    Academic: [],
    Cultural: [],
    Other: []
  };
  
  selectedDateEvents.forEach(event => {
    if (categories[event.category]) {
      categories[event.category].push(event);
    } else {
      categories.Other.push(event);
    }
  });
  
  return categories;
};

// Color mapping for different event categories
export const categoryColors: Record<string, { bg: string, text: string }> = {
  Hackathons: { bg: 'bg-blue-500', text: 'text-white' },
  Workshops: { bg: 'bg-green-500', text: 'text-white' },
  Fests: { bg: 'bg-purple-500', text: 'text-white' },
  Social: { bg: 'bg-yellow-500', text: 'text-white' },
  Sports: { bg: 'bg-red-500', text: 'text-white' },
  Academic: { bg: 'bg-indigo-500', text: 'text-white' },
  Cultural: { bg: 'bg-pink-500', text: 'text-white' },
  Other: { bg: 'bg-gray-500', text: 'text-white' }
};

// Helper function to get the color for a category
export const getCategoryColor = (category: string) => {
  return categoryColors[category] || { bg: 'bg-gray-500', text: 'text-white' };
};

// Helper to get dates with events for highlighting in the calendar
export const getDayClassNames = (day: Date, events: any[]) => {
  // Check if any events are on this day
  const hasEvents = events.some(event => isSameDay(new Date(event.date), day));
  
  const classNames = [];
  if (isToday(day)) classNames.push("bg-accent text-accent-foreground");
  if (hasEvents) classNames.push("bg-primary/15 font-semibold");
  
  return classNames.join(' ');
};

// Get event card category styling
export const getEventCardCategoryStyle = (category: string, isOfficial: boolean): string => {
  const categoryColorMap: Record<string, string> = {
    'Hackathons': 'bg-blue-50 border-blue-200',
    'Workshops': 'bg-purple-50 border-purple-200',
    'Fests': 'bg-pink-50 border-pink-200',
    'Social': 'bg-green-50 border-green-200',
    'Sports': 'bg-red-50 border-red-200',
    'Academic': 'bg-indigo-50 border-indigo-200',
  };
  
  const defaultColor = isOfficial 
    ? 'bg-gradient-to-br from-blue-50 to-violet-50 border-blue-100'
    : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100';
  
  return categoryColorMap[category] || defaultColor;
};
