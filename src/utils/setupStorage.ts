
import { supabase } from '@/integrations/supabase/client';

/**
 * Simple check if the storage bucket exists
 * This function doesn't try to create buckets anymore as that's handled by the edge function
 */
export const checkStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      console.error(`Bucket ${bucketName} check error:`, error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Setup function that runs at app startup to ensure required storage buckets exist
 * This is a simplified version that just logs the results
 */
export const setupStorage = async (): Promise<void> => {
  console.log('Checking storage buckets...');
  
  try {
    // Check the existence of required buckets
    const profilesExists = await checkStorageBucket('profiles');
    const eventsExists = await checkStorageBucket('events');
    const clubsExists = await checkStorageBucket('clubs');
    const communitiesExists = await checkStorageBucket('communities');
    const certificatesExists = await checkStorageBucket('certificates');
    
    console.log(`Storage buckets status:
      - profiles: ${profilesExists ? 'exists' : 'missing'}
      - events: ${eventsExists ? 'exists' : 'missing'}
      - clubs: ${clubsExists ? 'exists' : 'missing'}
      - communities: ${communitiesExists ? 'exists' : 'missing'}
      - certificates: ${certificatesExists ? 'exists' : 'missing'}
    `);
  } catch (error) {
    console.error('Error during storage setup:', error);
  }
};

export default setupStorage;
