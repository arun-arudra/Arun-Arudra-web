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

export function useContentful(contentType: string, slug?: string) {
  const [items, setItems] = useState<ContentfulItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
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
        if (data.error) setError(data.error);
        else {
          // Sort: featured first, then by order asc, then by updatedAt desc
          const sorted = [...(data.items || [])].sort((a: ContentfulItem, b: ContentfulItem) => {
            const fa = a.featured ? 1 : 0;
            const fb = b.featured ? 1 : 0;
            if (fa !== fb) return fb - fa;
            const oa = typeof a.order === "number" ? a.order : 9999;
            const ob = typeof b.order === "number" ? b.order : 9999;
            if (oa !== ob) return oa - ob;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
          setItems(sorted);
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [contentType, slug]);

  return { items, loading, error };
}

export function getImageUrl(image?: ContentfulImage[] | ContentfulImage): string {
  if (!image) return "/placeholder.svg";
  if (Array.isArray(image)) return image[0]?.url || "/placeholder.svg";
  return image.url || "/placeholder.svg";
}
