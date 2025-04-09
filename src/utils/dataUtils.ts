
/**
 * Utility functions for working with data
 */

/**
 * Safely get member count from community or club data
 */
export const getMemberCount = (entity: any): number => {
  return entity?.members_count || entity?.member_count || 0;
};

/**
 * Safely get attendee count from event data
 */
export const getAttendeeCount = (event: any): number => {
  return (event as any)?.attendee_count || 0;
};

/**
 * Get default category for clubs when not specified
 */
export const getDefaultCategory = (): string => {
  return 'General';
};
