
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
 * Ensures that all required storage buckets exist
 */
export const ensureStorageBuckets = async () => {
  try {
    // Create the public bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing storage buckets:', bucketsError);
      return false;
    }
    
    // Check if each bucket exists, create if not
    const bucketNames = Object.values(STORAGE_BUCKETS);
    const existingBuckets = new Set(buckets?.map(bucket => bucket.name) || []);
    
    for (const bucketName of bucketNames) {
      if (!existingBuckets.has(bucketName)) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true, // Make buckets public so files can be accessed without authentication
        });
        
        if (createError) {
          console.error(`Error creating bucket ${bucketName}:`, createError);
          return false;
        }
      }
    }
    
    console.log('✅ Storage buckets checked/created');
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
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
 */
export const initializeStorage = async () => {
  const result = await ensureStorageBuckets();
  if (!result) {
    toast.error("Failed to initialize storage", {
      description: "Some features may not work correctly. Please refresh the page or try again later.",
    });
  }
  return result;
};
