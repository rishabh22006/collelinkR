
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Storage bucket names used in the application
 */
export const STORAGE_BUCKETS = {
  PUBLIC: 'public',
  CLUB_LOGOS: 'club-logos',
  CLUB_BANNERS: 'club-banners',
  COMMUNITY_LOGOS: 'community-logos',
  COMMUNITY_BANNERS: 'community-banners',
};

/**
 * Helper function to get a public URL for a file in a specific bucket
 */
export const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Upload a file to a specified bucket
 * @returns The public URL of the uploaded file, or null if upload failed
 */
export const uploadFile = async (bucketName: string, file: File): Promise<string | null> => {
  try {
    // Generate a unique file name to avoid conflicts
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
      
    if (uploadError) {
      console.error(`Error uploading to ${bucketName}:`, uploadError);
      toast.error("Failed to upload file", {
        description: uploadError.message,
      });
      return null;
    }
    
    // Get the public URL
    return getPublicUrl(bucketName, filePath);
  } catch (error) {
    console.error('Error in uploadFile:', error);
    toast.error("Failed to upload file");
    return null;
  }
};

/**
 * Initialize storage when the app starts
 * Instead of trying to create buckets from the client (which fails due to RLS),
 * we'll just check if we can access the buckets and provide appropriate feedback
 */
export const initializeStorage = async () => {
  try {
    // Just list buckets to check access - we won't try to create them from client
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.warn('Storage initialization check failed:', error);
      // Don't show toast for this - it's just a check, not critical for user experience
      return false;
    }
    
    const bucketNames = Object.values(STORAGE_BUCKETS);
    const existingBuckets = new Set(buckets?.map(bucket => bucket.name) || []);
    
    // Log which buckets exist for debugging
    console.log('Available storage buckets:', existingBuckets);
    console.log('Required buckets:', bucketNames);
    
    // Just check if buckets exist, don't try to create them
    const missingBuckets = bucketNames.filter(name => !existingBuckets.has(name));
    
    if (missingBuckets.length > 0) {
      console.warn('Some required storage buckets are missing:', missingBuckets);
      return false;
    }
    
    console.log('✅ Storage buckets check completed');
    return true;
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    return false;
  }
};
