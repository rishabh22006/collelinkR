
// This function ensures that necessary storage buckets exist
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Process request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Define the buckets we want to ensure exist
    const bucketsToCreate = [
      { id: "public", public: true, fileSizeLimit: 5242880 }, // 5MB limit
      { id: "avatars", public: true, fileSizeLimit: 2097152 }, // 2MB limit
      { id: "club-logos", public: true, fileSizeLimit: 2097152 },
      { id: "club-banners", public: true, fileSizeLimit: 5242880 },
      { id: "community-logos", public: true, fileSizeLimit: 2097152 },
      { id: "community-banners", public: true, fileSizeLimit: 5242880 },
    ];

    // List existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const existingBucketIds = existingBuckets?.map(bucket => bucket.id) || [];
    
    // Create each missing bucket
    const creationResults = [];
    for (const bucket of bucketsToCreate) {
      if (!existingBucketIds.includes(bucket.id)) {
        const { data, error } = await supabase.storage.createBucket(
          bucket.id, 
          { 
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit
          }
        );
        
        creationResults.push({
          bucket: bucket.id,
          created: !error,
          error: error?.message || null
        });
      } else {
        creationResults.push({
          bucket: bucket.id,
          created: false,
          exists: true
        });
      }
    }

    // Return results
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Storage buckets checked/created",
        results: creationResults 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      }
    );
  } catch (error) {
    console.error("Error in storage bucket creation:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to create storage buckets", 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
