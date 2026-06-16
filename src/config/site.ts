/**
 * Central site configuration.
 *
 * Edit values here directly, or override via .env (VITE_* vars take precedence).
 * Restart the dev server after changing .env.
 */

const envBool = (v: string | undefined, fallback: boolean) =>
  v === undefined || v === "" ? fallback : v !== "false";

const envInt = (v: string | undefined, fallback: number) => {
  const n = parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const siteConfig = {
  /** Max featured projects to show on the homepage (1–10). */
  featuredProjectsLimit: envInt(import.meta.env.VITE_FEATURED_LIMIT, 4),

  /** Max latest blog posts on the homepage. */
  latestBlogLimit: envInt(import.meta.env.VITE_BLOG_LIMIT, 3),

  /** Master switch for all sponsor / ad slots. */
  sponsorEnabled: envBool(import.meta.env.VITE_SPONSOR_ENABLED, true),

  /** Google AdSense Publisher ID, e.g. "ca-pub-1234567890123456". */
  adsenseClient:
    (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) ||
    // 👇 Or hard-code a dummy/live value here so you don't have to touch .env
    "",

  /** Default AdSense slot ID. */
  adsenseSlot:
    (import.meta.env.VITE_ADSENSE_SLOT as string | undefined) || "",
};
