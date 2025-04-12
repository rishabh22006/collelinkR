
import { supabase } from '@/integrations/supabase/client';

// Define storage bucket constants
export const STORAGE_BUCKETS = {
  PUBLIC: 'public',
};

/**
 * Check if all required storage buckets exist
 * @returns {Promise<boolean>} True if all buckets exist, false otherwise
 */
export const initializeStorage = async (): Promise<boolean> => {
  try {
    // Get list of all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return false;
    }
    
    // Create a set of existing bucket names
    const existingBuckets = new Set(buckets?.map(bucket => bucket.name) || []);
    console.info('Available storage buckets:', existingBuckets);
    
    // Define required buckets
    const requiredBuckets = Object.values(STORAGE_BUCKETS);
    console.info('Required buckets:', requiredBuckets);
    
    // Check if all required buckets exist
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.has(bucket));
    
    if (missingBuckets.length > 0) {
      console.warn('Some required storage buckets are missing:', missingBuckets);
      return false; // Indicate that client-side initialization failed
    }
    
    return true; // All required buckets exist
  } catch (err) {
    console.error('Error initializing storage:', err);
    return false;
  }
};
