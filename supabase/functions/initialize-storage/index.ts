
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Storage bucket names used in the application
const STORAGE_BUCKETS = [
  'public',
  'club-logos',
  'club-banners',
  'community-logos',
  'community-banners',
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create authenticated Supabase client using the service role key (this has admin privileges)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // List existing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    const existingBuckets = new Set(buckets?.map(bucket => bucket.name) || []);
    const results = [];

    // Create any missing buckets
    for (const bucketName of STORAGE_BUCKETS) {
      if (!existingBuckets.has(bucketName)) {
        console.log(`Creating bucket: ${bucketName}`);
        
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true, // Make buckets public so files can be accessed without authentication
          fileSizeLimit: bucketName === 'club-banners' || bucketName === 'community-banners' ? 10485760 : 5242880, // 10MB for banners, 5MB for others
        });
        
        if (createError) {
          results.push({ bucket: bucketName, success: false, error: createError.message });
        } else {
          // Set public access policies for the bucket
          const { error: policyError } = await supabase.storage.from(bucketName).createPolicy('public-read-write', {
            name: 'Public Read Write',
            definition: {
              statements: [{
                effect: 'allow',
                action: 'all',
                principal: '*',
              }]
            }
          });
          
          if (policyError) {
            results.push({ bucket: bucketName, success: true, created: true, policyError: policyError.message });
          } else {
            results.push({ bucket: bucketName, success: true, created: true, policy: 'created' });
          }
        }
      } else {
        results.push({ bucket: bucketName, success: true, exists: true });
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Storage initialization error:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
