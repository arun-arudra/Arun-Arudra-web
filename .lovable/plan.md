

# ArunArudra — Premium Portfolio & Agency Website

## Overview
A modern, high-end portfolio website for ArunArudra (UI/UX Designer) with system-based dark/light mode, orange accent (#fd5320), and premium interaction design. Content for Projects and News loaded from Contentful CMS for easy updates while maintaining SEO.

---

## Pages & Features

### 1. Home Page
- **Hero section** with bold typography, value proposition, and a **morphing gradient blob** (animated CSS/canvas blob using #fd5320 gradients that shifts and morphs smoothly)
- Featured services grid (3-4 top services)
- Featured projects carousel (pulled from Contentful)
- Latest news/articles section
- Strong CTA to contact
- Smooth scroll-triggered fade-in animations throughout

### 2. Services Page
- Service cards with icons, descriptions, and process overview
- Services: UI/UX Design, Product Design, Website Design, Branding, Development Support
- Clean grid layout with hover interactions

### 3. Projects Page
- Project listing with filterable cards (category tags)
- Each project card: title, thumbnail, summary, category
- **Individual project pages** (dynamic routes) with rich content from Contentful:
  - Title, summary, client/context, problem, role, process highlights, key features, final visuals, outcome, tools used
  - Related projects and related articles
- Content structure matches the reference image provided

### 4. About Page
- Personal story, experience summary, design philosophy
- Tools & skills section
- Professional but friendly tone

### 5. News Page
- Blog-style article listing with cards (title, excerpt, date, category, image)
- Individual article pages with full content from Contentful
- SEO-optimized with proper headings and meta

### 6. Contact Page
- Modern, minimal contact form (name, email, message)
- Email contact info with icon (hi@arunarudra.com)
- Clean design with supporting copy and CTA

---

## Design System
- **Theme**: System-based (auto dark/light), toggle available
- **Colors**: Neutral blacks/whites/grays with #fd5320 as strategic accent
- **Typography**: Bold, clean, modern (Inter or similar)
- **Cards**: Subtle shadows, borders, hover states
- **Spacing**: Generous, structured layouts
- **Buttons**: Rounded, refined with orange accent

## Interaction Design
- Morphing gradient blob on hero (CSS/canvas animation)
- Smooth page transitions and scroll-triggered reveals
- Hover effects on cards, links, and buttons
- Underline animations on navigation links

## Footer (matching reference)
- Dark, premium footer with navigation links
- Social media icons (Facebook, X, Instagram, LinkedIn, GitHub, etc.)
- Newsletter subscription card (working — stores to Supabase)
- "Have more questions?" CTA card with orange background and "Book a call now" link
- Copyright, Privacy Policy, Terms & Conditions
- **Special scroll-to-top button** (desktop only): Fixed while scrolling → visually "drops" into footer when reached → morphs into a bouncing ball → reacts to mouse movement → settles when mouse stops → returns to normal when scrolling away

## SEO
- Semantic HTML with proper heading hierarchy
- Unique page titles and meta descriptions per page
- Alt text on all images
- Clean URL structure
- Structured data (JSON-LD) for organization and articles
- Crawlable internal links
- Fast, responsive on all devices

## Backend & Content
- **Contentful** connector for Projects and News content (headless CMS)
- **Supabase** (Lovable Cloud) for newsletter subscriptions and contact form submissions
- Edge function to fetch Contentful content server-side for SEO
- Edge function for contact form handling

## Responsive Design
- Fully responsive: mobile, tablet, desktop
- Desktop gets richer interactions (blob, bouncing ball footer)
- Mobile stays fast and clean with simplified animations

