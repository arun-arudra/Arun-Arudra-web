import { useEffect, useState } from "react";

const FN_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/contentful`;

export interface ContentfulImage {
  url: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface ContentfulItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  slug?: string;
  image?: ContentfulImage[] | ContentfulImage;
  overview?: any;
  challenge?: any;
  body?: any;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  sections?: any[];
  layoutVariant?: string;
  [key: string]: any;
}

// In-memory cache shared across components for the lifetime of the SPA.
// Also persisted to sessionStorage so the next page load is instant.
const memCache = new Map<string, ContentfulItem[]>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function readSession(key: string): ContentfulItem[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; v: ContentfulItem[] };
    if (Date.now() - parsed.t > TTL_MS) return null;
    return parsed.v;
  } catch {
    return null;
  }
}

function writeSession(key: string, v: ContentfulItem[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {
    /* quota — ignore */
  }
}

function sortItems(items: ContentfulItem[]) {
  return [...items].sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    const oa = typeof a.order === "number" ? a.order : 9999;
    const ob = typeof b.order === "number" ? b.order : 9999;
    if (oa !== ob) return oa - ob;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function useContentful(contentType: string, slug?: string) {
  const cacheKey = `cf:${contentType}:${slug ?? "*"}`;
  const initial = memCache.get(cacheKey) ?? readSession(cacheKey) ?? [];
  const [items, setItems] = useState<ContentfulItem[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = memCache.get(cacheKey) ?? readSession(cacheKey);
    if (cached && cached.length > 0) {
      setItems(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams({ content_type: contentType, limit: "100" });
    if (slug) params.set("slug", slug);

    fetch(`${FN_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          const sorted = sortItems(data.items || []);
          memCache.set(cacheKey, sorted);
          writeSession(cacheKey, sorted);
          setItems(sorted);
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [contentType, slug, cacheKey]);

  return { items, loading, error };
}

export function getImageUrl(image?: ContentfulImage[] | ContentfulImage): string {
  if (!image) return "/placeholder.svg";
  if (Array.isArray(image)) return image[0]?.url || "/placeholder.svg";
  return image.url || "/placeholder.svg";
}
