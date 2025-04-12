
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Get JWT token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with JWT token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
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
        });
        
        if (createError) {
          results.push({ bucket: bucketName, success: false, error: createError.message });
        } else {
          results.push({ bucket: bucketName, success: true });
        }
      } else {
        results.push({ bucket: bucketName, success: true, exists: true });
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
