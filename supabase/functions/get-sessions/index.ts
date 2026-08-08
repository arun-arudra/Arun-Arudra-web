import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Simple CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Your Logic here (fetching from Contentful using Deno.env.get)
  const SPACE_ID = Deno.env.get('CONTENTFUL_SPACE_ID');
  
  return new Response(JSON.stringify({ message: "Ready" }), { 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });
});