

# ArunArudra Website Redesign — From Portfolio to Premium Agency

## The Problem
The current site feels like a personal freelancer template — uniform card grids, repetitive section patterns, and basic hover effects. A client landing on this should feel the same authority they'd get from sites like Concealed or Galvanite.

## Design Direction
Not copying any one site. Instead, taking the best patterns from your references and making them uniquely ArunArudra:

- **Concealed's Services page**: Structured service categories with numbered sub-items, illustrative icons, and a "How we bring ideas to life" process timeline
- **Galvanite's Case Studies**: Full-width project cards in a continuous vertical scroll with large imagery, service tags with diamond bullet separators, and hover arrow reveals
- **Your brand**: Keep the #fd5320 orange, Space Grotesk + Inter, morphing blob, and existing footer/newsletter/contact backend

---

## Homepage Redesign

### Section 1: Hero (keep current structure, refine)
- Split layout stays. Add a **client testimonial quote** below the CTA buttons (like Concealed's hero) for instant social proof
- Add **3 trust checkmarks** below CTA: "User-First Design", "Conversion Focused", "Pixel-Perfect Delivery"

### Section 2: Trusted By (NEW)
- Horizontal auto-scrolling logo marquee of past clients/brands
- Subtle, grayscale logos on dark, white on light mode
- Creates instant credibility — no agency site skips this

### Section 3: What We Do (Services Preview)
- Replace the 4-column card grid with **3 large feature blocks** — each takes ~1/3 width
- Each block: large number (01, 02, 03), service title, short description, and a list of sub-services
- On hover: subtle background gradient shift with the orange accent
- Link to full Services page

### Section 4: Featured Projects (Galvanite-inspired)
- **Full-width stacked cards**, not a 3-column grid
- Each project: large 16:9 image taking full width, with title + service tags overlaid at bottom
- Service tags separated by diamond bullets (like Galvanite)
- On hover: subtle scale + an arrow icon appears (top-right corner)
- Show 3 featured projects, then "Explore All Work" button

### Section 5: Why Choose ArunArudra (NEW — from Concealed)
- 2x2 grid of value proposition cards with icons
- "Always in the loop", "Your vision, our expertise", "Efficiency that meets pace", "Built for long-term success"
- Each card: icon, title, description paragraph
- Builds trust and differentiates from generic portfolios

### Section 6: Latest News (refine)
- Featured article hero (first article full-width with large image + title overlay)
- 2 remaining articles as smaller cards below
- Not a uniform 3-column grid

### Section 7: CTA (keep, enhance)
- Add an auto-scrolling project image marquee behind the CTA text (like Concealed/Galvanite footer marquees)
- Text: "Ready to accelerate your growth?"

---

## Services Page Redesign (Concealed-inspired)

### Hero
- Large headline left-aligned: "A team that brings bold digital experiences to life"
- Subtitle paragraph below
- Right side: animated collage of project screenshots (stacked, slightly rotated, auto-cycling)

### Service Categories (NOT a card grid)
Replace the 6-card grid with **4 expandable service pillars**:

1. **Strategy** — Market Research, Brand Positioning, Product Strategy, Operations
2. **Design** — UX/UI Design, Brand Design, Motion Design (with sub-items listed)
3. **Development** — Frontend, Backend, DevOps
4. **Optimization** — Performance, Retention, Engagement

Each pillar:
- Illustrative icon (custom or Lucide)
- Category title + bold tagline
- Numbered sub-categories with nested service items
- Accordion-style expand on click (mobile), all visible on desktop

### Process Timeline (NEW)
- "How we bring ideas to life" — 4-step horizontal timeline
- Steps: Discovery & Definition → Design & Prototyping → Development & Testing → Refine & Optimize
- Each step: number, title, description paragraph
- Alternating layout (step number on left/right)

### Solutions Section (NEW)
- "The impactful digital solutions we build"
- 3 large cards: Websites, Apps, Products
- Each: full-width image, title, description, tags
- Stacked vertically, not side-by-side

### CTA
- "Ready to turn ideas into high-performing products?"

---

## Projects Page Redesign

- Replace filterable grid with **full-width stacked project cards** (Galvanite style)
- Each card: large image (full container width), service tags with diamond separators, project headline
- Hover: scale image slightly, show arrow indicator
- Each links to `/projects/:slug`

---

## Project Detail Page (NEW)
- Add route `/projects/:slug` in App.tsx
- Full-bleed hero image with title overlay
- Structured sections: About, The Challenge, The Process (icon steps), Strategy, Design, Results
- Big stat numbers for impact/results
- Related projects at bottom
- Placeholder content for now

---

## News Page
- Featured article hero (first article large, full-width)
- Remaining articles in 2-column offset layout
- Not uniform 3-col grid

---

## About & Contact Pages
- Keep current structure, minor polish only
- About: change "I" language to "We" (agency voice)

---

## New Components to Create
1. `LogoMarquee.tsx` — auto-scrolling client logo strip
2. `ProjectCard.tsx` — full-width project card with hover effects
3. `ServicePillar.tsx` — expandable service category block
4. `ProcessTimeline.tsx` — horizontal 4-step process
5. `ProjectDetail.tsx` — case study detail page
6. `DiamondSeparator.tsx` — small diamond bullet between tags

## Files to Edit
- `src/pages/Index.tsx` — full homepage redesign
- `src/pages/Services.tsx` — Concealed-inspired redesign
- `src/pages/Projects.tsx` — stacked full-width cards
- `src/pages/News.tsx` — featured hero + offset grid
- `src/pages/About.tsx` — change to "we" voice
- `src/App.tsx` — add `/projects/:slug` route
- `tailwind.config.ts` — add marquee animation keyframe

## What Stays Unchanged
- Color system, fonts, theme toggle
- Navbar (with "Book a Call" CTA)
- Footer (newsletter + CTA cards + bouncing ball)
- Contact form + Supabase backend
- MorphingBlob, MagneticButton, AnimatedSection, TextReveal, StaggerContainer
- All existing animation infrastructure

