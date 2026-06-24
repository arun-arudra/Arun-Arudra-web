/**
 * Central site configuration.
 *
 * All values can be overridden through .env (VITE_* vars take precedence).
 * Restart the dev server after changing .env. Variables are also safe to set
 * via GitHub Actions secrets — the build step injects them.
 */

const envBool = (v: string | undefined, fallback: boolean) =>
  v === undefined || v === "" ? fallback : v !== "false";

const envInt = (v: string | undefined, fallback: number) => {
  const n = parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const envStr = (v: string | undefined, fallback: string) =>
  v && v.trim() !== "" ? v : fallback;

export const siteConfig = {
  // ---------- Content limits ----------
  featuredProjectsLimit: envInt(import.meta.env.VITE_FEATURED_LIMIT, 4),
  latestBlogLimit: envInt(import.meta.env.VITE_BLOG_LIMIT, 3),
  newsPerPage: envInt(import.meta.env.VITE_NEWS_PER_PAGE, 10),

  // ---------- Sponsor / Ads ----------
  sponsorEnabled: envBool(import.meta.env.VITE_SPONSOR_ENABLED, true),
  adsenseClient: envStr(import.meta.env.VITE_ADSENSE_CLIENT, ""),
  adsenseSlot: envStr(import.meta.env.VITE_ADSENSE_SLOT, ""),

  // ---------- Branding ----------
  brandName: envStr(import.meta.env.VITE_BRAND_NAME, "ArunArudra"),
  copyrightText: envStr(
    import.meta.env.VITE_COPYRIGHT,
    `Copyright © ${new Date().getFullYear()} - ArunArudra`,
  ),

  // ---------- Contact ----------
  /** Public mailto address shown on the contact page. */
  contactEmail: envStr(import.meta.env.VITE_CONTACT_EMAIL, "hi@arunarudra.com"),
  /** Internal recipient that receives form submissions (used by edge funcs / forwarders). */
  contactRecipient: envStr(
    import.meta.env.VITE_CONTACT_RECIPIENT,
    envStr(import.meta.env.VITE_CONTACT_EMAIL, "hi@arunarudra.com"),
  ),

  // ---------- Social links ----------
  social: {
    facebook: envStr(import.meta.env.VITE_SOCIAL_FACEBOOK, ""),
    twitter: envStr(import.meta.env.VITE_SOCIAL_TWITTER, ""),
    instagram: envStr(import.meta.env.VITE_SOCIAL_INSTAGRAM, ""),
    linkedin: envStr(import.meta.env.VITE_SOCIAL_LINKEDIN, ""),
    github: envStr(import.meta.env.VITE_SOCIAL_GITHUB, ""),
  },
};
