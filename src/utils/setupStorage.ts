
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that all required storage buckets exist
 */
export const ensureStorageBuckets = async () => {
  try {
    await supabase.functions.invoke('ensure-storage-bucket');
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
