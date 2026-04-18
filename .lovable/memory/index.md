# Memory: index.md
Updated: now

# Project Memory

## Core
Dark/light mode with system default. Primary accent #fd5320 (orange). Space Grotesk headings, Inter body.
Brand: ArunArudra — UI/UX Designer portfolio & agency. Neutral B&W + orange accent.
Footer is ALWAYS dark (#0a0a0a/black) in both light and dark modes. Reference-style: newsletter card + orange CTA card, animated orb, magnetic socials.
Contentful wired via supabase/functions/contentful — Projects + News pull live; falls back to local data. Article route /news/:slug.
Sponsor/ad slot only on News list + article pages (SponsorSlot component) — minimal, dismissible (24h localStorage), never on other pages.
Desktop-only scroll-to-top button morphs into bouncing ball in footer.

## Memories
- [Design tokens](mem://design/tokens) — Full color system, fonts, surface tokens
- [Footer interaction](mem://features/footer-ball) — Scroll-to-top button physics behavior spec
- [Content strategy](mem://features/content) — Contentful for Projects/News, Supabase for forms
