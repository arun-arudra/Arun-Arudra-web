import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/contentful";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const CONTENTFUL_API_KEY = Deno.env.get("CONTENTFUL_API_KEY");
  if (!CONTENTFUL_API_KEY) {
    return new Response(JSON.stringify({ error: "CONTENTFUL_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const CONTENTFUL_SPACE_ID = Deno.env.get("CONTENTFUL_SPACE_ID");
  if (!CONTENTFUL_SPACE_ID) {
    return new Response(JSON.stringify({ error: "CONTENTFUL_SPACE_ID not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const contentType = url.searchParams.get("content_type") || "project";
    const limit = url.searchParams.get("limit") || "100";
    const slug = url.searchParams.get("slug");

    let apiUrl = `${GATEWAY_URL}/spaces/${CONTENTFUL_SPACE_ID}/entries?content_type=${contentType}&limit=${limit}&include=2`;
    
    if (slug) {
      apiUrl += `&fields.slug=${slug}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": CONTENTFUL_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Contentful API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();

    // Resolve linked assets
    const assetsMap: Record<string, any> = {};
    if (data.includes?.Asset) {
      for (const asset of data.includes.Asset) {
        assetsMap[asset.sys.id] = {
          url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : null,
          title: asset.fields.title,
          width: asset.fields.file?.details?.image?.width,
          height: asset.fields.file?.details?.image?.height,
        };
      }
    }

    // Resolve linked entries
    const entriesMap: Record<string, any> = {};
    if (data.includes?.Entry) {
      for (const entry of data.includes.Entry) {
        entriesMap[entry.sys.id] = entry.fields;
      }
    }

    // Transform entries with resolved links
    const items = data.items.map((item: any) => {
      const fields = { ...item.fields };
      
      // Resolve asset links in fields
      for (const [key, value] of Object.entries(fields)) {
        if (value && typeof value === "object") {
          const v = value as any;
          if (v.sys?.type === "Link" && v.sys?.linkType === "Asset") {
            fields[key] = assetsMap[v.sys.id] || null;
          } else if (v.sys?.type === "Link" && v.sys?.linkType === "Entry") {
            fields[key] = entriesMap[v.sys.id] || null;
          } else if (Array.isArray(value)) {
            fields[key] = (value as any[]).map((item: any) => {
              if (item?.sys?.type === "Link" && item?.sys?.linkType === "Asset") {
                return assetsMap[item.sys.id] || null;
              }
              if (item?.sys?.type === "Link" && item?.sys?.linkType === "Entry") {
                return entriesMap[item.sys.id] || null;
              }
              return item;
            });
          }
        }
      }

      return {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
        ...fields,
      };
    });

    return new Response(JSON.stringify({ items, total: data.total }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Contentful fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
