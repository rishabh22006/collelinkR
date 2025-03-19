
import { Event } from '@/hooks/useEvents';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const categories = ['Hackathons', 'Workshops', 'Fests', 'Social', 'Sports', 'Academic'];
const organizers = ['Tech Club', 'Student Council', 'Cultural Committee', 'Sports Committee', 'Academic Society'];
const locations = ['Main Auditorium', 'Sports Ground', 'Lecture Hall A', 'Campus Center', 'Engineering Block'];

export interface MockEventProps {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: string;
  attendees: number;
  organizer: string;
  isLive?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
}

export const mockEvents: MockEventProps[] = [
  {
    id: '1',
    title: 'Annual Tech Hackathon',
    date: generateRandomDate(today, nextWeek),
    location: 'Main Auditorium',
    category: 'Hackathons',
    attendees: 120,
    organizer: 'Tech Club',
    isLive: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    title: 'Spring Cultural Fest',
    date: generateRandomDate(today, nextWeek),
    location: 'Campus Center',
    category: 'Fests',
    attendees: 350,
    organizer: 'Cultural Committee',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    title: 'AI Workshop Series',
    date: generateRandomDate(today, nextWeek),
    location: 'Lecture Hall A',
    category: 'Workshops',
    attendees: 75,
    organizer: 'Academic Society',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

// Generate more mock events
for (let i = 4; i <= 10; i++) {
  mockEvents.push({
    id: i.toString(),
    title: `Event ${i}`,
    date: generateRandomDate(today, nextWeek),
    location: locations[Math.floor(Math.random() * locations.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    attendees: getRandomInt(20, 200),
    organizer: organizers[Math.floor(Math.random() * organizers.length)],
    isLive: Math.random() > 0.8,
    isFeatured: Math.random() > 0.8,
    imageUrl: i % 2 === 0 ? `https://picsum.photos/seed/${i}/800/600` : undefined
  });
}
