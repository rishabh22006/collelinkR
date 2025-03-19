
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

const categories = ['Hackathons', 'Workshops', 'Fests', 'Social', 'Sports', 'Academic', 'Cultural'];
const organizers = [
  'MIT Tech Club', 
  'MIT Student Council', 
  'ADTU Cultural Committee', 
  'MIT Sports Committee', 
  'MIT ACM Chapter',
  'MIT IEEE Student Branch',
  'MIT Entrepreneurship Cell'
];
const locations = [
  'Main Auditorium',
  'Sports Ground',
  'Lecture Hall Complex',
  'MIT Campus Center',
  'Engineering Block',
  'ADTU Open Air Theatre',
  'MIT Library'
];

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
    title: 'MIT Annual Tech Hackathon',
    date: generateRandomDate(today, nextWeek),
    location: 'MIT Main Auditorium',
    category: 'Hackathons',
    attendees: 120,
    organizer: 'MIT Tech Club',
    isLive: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    title: 'ADTU Cultural Fest - Rhythm 2023',
    date: generateRandomDate(today, nextWeek),
    location: 'ADTU Open Air Theatre',
    category: 'Fests',
    attendees: 350,
    organizer: 'ADTU Cultural Committee',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    title: 'AI & Machine Learning Workshop Series',
    date: generateRandomDate(today, nextWeek),
    location: 'Lecture Hall Complex',
    category: 'Workshops',
    attendees: 75,
    organizer: 'MIT IEEE Student Branch',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '4',
    title: 'MIT Sports Meet 2023',
    date: generateRandomDate(today, nextWeek),
    location: 'Sports Ground',
    category: 'Sports',
    attendees: 200,
    organizer: 'MIT Sports Committee',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '5',
    title: 'Entrepreneurship Summit',
    date: generateRandomDate(today, nextWeek),
    location: 'MIT Campus Center',
    category: 'Workshops',
    attendees: 120,
    organizer: 'MIT Entrepreneurship Cell',
    isLive: true,
    imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '6',
    title: 'Research Paper Presentation Competition',
    date: generateRandomDate(today, nextWeek),
    location: 'Engineering Block',
    category: 'Academic',
    attendees: 60,
    organizer: 'MIT IEEE Student Branch',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '7',
    title: 'MIT Coding Competition',
    date: generateRandomDate(today, nextWeek),
    location: 'Lecture Hall Complex',
    category: 'Hackathons',
    attendees: 85,
    organizer: 'MIT ACM Chapter',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '8',
    title: 'ADTU Dance Workshop',
    date: generateRandomDate(today, nextWeek),
    location: 'ADTU Open Air Theatre',
    category: 'Cultural',
    attendees: 50,
    organizer: 'ADTU Cultural Committee',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '9',
    title: 'MIT Alumni Meet 2023',
    date: generateRandomDate(today, nextWeek),
    location: 'MIT Campus Center',
    category: 'Social',
    attendees: 150,
    organizer: 'MIT Student Council',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '10',
    title: 'Library Week - Book Exhibition',
    date: generateRandomDate(today, nextWeek),
    location: 'MIT Library',
    category: 'Academic',
    attendees: 70,
    organizer: 'MIT Student Council',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];
