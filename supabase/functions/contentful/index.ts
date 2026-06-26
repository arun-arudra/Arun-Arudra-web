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
  const CONTENTFUL_API_KEY = Deno.env.get("CONTENTFUL_API_KEY");
  const CONTENTFUL_SPACE_ID = Deno.env.get("CONTENTFUL_SPACE_ID");
  if (!LOVABLE_API_KEY || !CONTENTFUL_API_KEY || !CONTENTFUL_SPACE_ID) {
    console.error("Contentful function missing required configuration");
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 503,
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

    // Helper to resolve link fields (assets and entries) inside a fields object
    const resolveFields = (fields: any) => {
      const out: any = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value && typeof value === "object") {
          const v = value as any;
          if (v.sys?.type === "Link" && v.sys?.linkType === "Asset") {
            out[key] = assetsMap[v.sys.id] || null;
          } else if (v.sys?.type === "Link" && v.sys?.linkType === "Entry") {
            // placeholder, second pass will fill
            out[key] = { __entryLink: v.sys.id };
          } else if (Array.isArray(value)) {
            out[key] = (value as any[]).map((it: any) => {
              if (it?.sys?.type === "Link" && it?.sys?.linkType === "Asset") return assetsMap[it.sys.id] || null;
              if (it?.sys?.type === "Link" && it?.sys?.linkType === "Entry") return { __entryLink: it.sys.id };
              return it;
            });
          } else {
            out[key] = value;
          }
        } else {
          out[key] = value;
        }
      }
      return out;
    };

    // Resolve linked entries (preserve content type id) — first pass
    const entriesMap: Record<string, any> = {};
    if (data.includes?.Entry) {
      for (const entry of data.includes.Entry) {
        entriesMap[entry.sys.id] = {
          _id: entry.sys.id,
          _type: entry.sys.contentType?.sys?.id,
          ...resolveFields(entry.fields),
        };
      }
    }

    // Second pass: replace __entryLink placeholders with resolved entries
    const fillEntryLinks = (val: any): any => {
      if (Array.isArray(val)) return val.map(fillEntryLinks);
      if (val && typeof val === "object") {
        if (val.__entryLink) return entriesMap[val.__entryLink] || null;
        const out: any = {};
        for (const [k, v] of Object.entries(val)) out[k] = fillEntryLinks(v);
        return out;
      }
      return val;
    };
    for (const id of Object.keys(entriesMap)) {
      entriesMap[id] = fillEntryLinks(entriesMap[id]);
    }

    // Transform top-level entries with resolved links
    const items = data.items.map((item: any) => ({
      id: item.sys.id,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
      _type: item.sys.contentType?.sys?.id,
      ...fillEntryLinks(resolveFields(item.fields)),
    }));

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
