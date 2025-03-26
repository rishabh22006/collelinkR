
import { format, isSameDay } from 'date-fns';

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
