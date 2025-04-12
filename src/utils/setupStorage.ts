
import { supabase } from '@/integrations/supabase/client';

// Define storage bucket constants
export const STORAGE_BUCKETS = {
  PUBLIC: 'public',
  CLUB_LOGOS: 'club-logos',
  CLUB_BANNERS: 'club-banners',
  COMMUNITY_LOGOS: 'community-logos',
  COMMUNITY_BANNERS: 'community-banners',
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

/**
 * Upload a file to a specific storage bucket
 * @param {string} bucket - The bucket name
 * @param {File} file - The file to upload
 * @returns {Promise<string|null>} The public URL of the uploaded file, or null if upload failed
 */
export const uploadFile = async (bucket: string, file: File): Promise<string | null> => {
  try {
    // Generate a unique filename using timestamp and random string
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error(`Error uploading file to ${bucket}:`, error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (err) {
    console.error(`Failed to upload file to ${bucket}:`, err);
    return null;
  }
};
