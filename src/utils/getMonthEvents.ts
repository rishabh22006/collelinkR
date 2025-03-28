
import { format } from 'date-fns';
import { Event } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches events for a specific month range
 */
export const getMonthEvents = async (startDate: string, endDate: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events for month range:', error);
      return [];
    }

    return data as Event[];
  } catch (err) {
    console.error('Failed to fetch events:', err);
    return [];
  }
};
