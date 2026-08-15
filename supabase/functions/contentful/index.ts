import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Contentful Content Delivery API (CDN — public read-only)
const CF_CDN = "https://cdn.contentful.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Read secrets from Supabase Edge Function environment
  // Set these in: Supabase Dashboard → Project → Edge Functions → Secrets
  //   CONTENTFUL_SPACE_ID   = p5n0cwz1lpb5
  //   CONTENTFUL_ACCESS_TOKEN = AlawF6pZuNlxENrg6BqIbXS3mYMCtvXKDtvvsPUrlKQ
  const SPACE_ID    = Deno.env.get("CONTENTFUL_SPACE_ID");
  const ACCESS_TOKEN = Deno.env.get("CONTENTFUL_ACCESS_TOKEN");

  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN");
    return new Response(
      JSON.stringify({ error: "Content service not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url      = new URL(req.url);
    const contentType = url.searchParams.get("content_type") || "project";
    const limit    = url.searchParams.get("limit") || "100";
    const slug     = url.searchParams.get("slug");

    const params = new URLSearchParams({
      content_type: contentType,
      limit,
      include: "2",
      access_token: ACCESS_TOKEN,
    });
    if (slug) params.set("fields.slug", slug);

    const apiUrl = `${CF_CDN}/spaces/${SPACE_ID}/environments/master/entries?${params}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Contentful API error [${response.status}]: ${errorText}`);
      throw new Error(`Contentful returned ${response.status}`);
    }

    const data = await response.json();

    // ── Resolve linked assets ──────────────────────────────────────────────
    const assetsMap: Record<string, any> = {};
    if (data.includes?.Asset) {
      for (const asset of data.includes.Asset) {
        assetsMap[asset.sys.id] = {
          url:    asset.fields.file?.url ? `https:${asset.fields.file.url}` : null,
          title:  asset.fields.title,
          width:  asset.fields.file?.details?.image?.width,
          height: asset.fields.file?.details?.image?.height,
        };
      }
    }

    // ── Resolve linked entries ─────────────────────────────────────────────
    const resolveFields = (fields: any) => {
      const out: any = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value && typeof value === "object") {
          const v = value as any;
          if (v.sys?.type === "Link" && v.sys?.linkType === "Asset") {
            out[key] = assetsMap[v.sys.id] || null;
          } else if (v.sys?.type === "Link" && v.sys?.linkType === "Entry") {
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

    const entriesMap: Record<string, any> = {};
    if (data.includes?.Entry) {
      for (const entry of data.includes.Entry) {
        entriesMap[entry.sys.id] = {
          _id:   entry.sys.id,
          _type: entry.sys.contentType?.sys?.id,
          ...resolveFields(entry.fields),
        };
      }
    }

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

    const items = data.items.map((item: any) => ({
      id:        item.sys.id,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
      _type:     item.sys.contentType?.sys?.id,
      ...fillEntryLinks(resolveFields(item.fields)),
    }));

    return new Response(JSON.stringify({ items, total: data.total }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Contentful fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to load content" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
