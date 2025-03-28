
import { useEventQuery } from './useEventQuery';
import { useEventAttendees } from './useEventAttendees';
import { Event, EventAttendee, EventWithAttendance } from '@/types/events';

export type { Event, EventAttendee, EventWithAttendance };

export const useEvents = () => {
  // Combine query and attendee management functionality
  const {
    events,
    featuredEvents,
    userEvents,
    isLoading,
    isFeaturedLoading,
    isUserEventsLoading,
    error,
    refetch,
  } = useEventQuery();

  const {
    getEventAttendees,
    registerForEvent,
    cancelRegistration,
    exportAttendeeList,
  } = useEventAttendees();

  // Return all functionality from both hooks
  return {
    // Event queries
    events,
    featuredEvents,
    userEvents,
    isLoading,
    isFeaturedLoading,
    isUserEventsLoading,
    error,
    refetch,
    
    // Attendee management
    getEventAttendees,
    registerForEvent,
    cancelRegistration,
    exportAttendeeList,
  };
};
