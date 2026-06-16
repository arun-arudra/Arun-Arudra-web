# Contentful Setup Guide

This site reads two content types from Contentful: **Project** (`project`) and **News** (`news`).

---

## 1. News (content type ID: `news`)

Your content type already has the right fields:

| Field | Type | Notes |
|---|---|---|
| `title` | Short text | Article title |
| `slug` | Short text | URL slug, e.g. `future-of-ui` → `/news/future-of-ui` |
| `category` | Short text | e.g. "Design Trends" |
| `excerpt` | Long text | Shown on cards + at the top of the article |
| `image` | Media (single) | Hero / card image — recommended 1600×900 |
| `body` | Long text | The full article. Paragraphs separated by blank lines render correctly. |

**Optional upgrade**: change `body` from *Long text* to *Rich text* in Contentful to get headings, lists, links, embedded images. The frontend already handles both.

---

## 2. Project (content type ID: `project`)

Your fields work as-is. Two are important for the homepage:

- **`featured` (Boolean)** — Check this on the projects you want pinned to the homepage's "Featured Projects" section.
- **`order` (Integer)** — Lower numbers appear first (e.g. `1`, `2`, `3`).

### Optional new field — separate hover image
The big image that appears next to your cursor on the homepage list uses the main `image` by default.  
To use a different image just for that hover preview:

1. In Contentful → Project content type → **Add field**.
2. Name: `Hover Image`, ID: `hoverImage`, type: **Media (single)**.
3. Upload a portrait or mockup-style image (recommended ~920×640).

The site will automatically pick it up.

### Custom per-project layouts (recommended)
Instead of using the legacy Overview/Challenge/Process/Results layout, you can **build each project from blocks**, so every case study can look different.

1. Create these **block** content types (each is just a small content type):
   - `blockText` — fields: `eyebrow` (Short), `heading` (Short), `body` (Rich text)
   - `blockImage` — fields: `image` (Media), `caption` (Short), `fullBleed` (Boolean)
   - `blockGallery` — fields: `images` (Media, many)
   - `blockQuote` — fields: `quote` (Long text), `attribution` (Short)
   - `blockVideo` — fields: `videoUrl` (Short, accepts YouTube), or `video` (Media)
   - `blockStats` — fields: `heading` (Short), `stats` (JSON: `[{value, suffix, label}]`)
   - `blockTwoColumn` — fields: `heading` (Short), `body` (Rich text), `image` (Media)
2. In **Project**, add field **`sections`** as **Reference (many)** and allow the block types above.
3. On any project entry, drag blocks into `sections` in the order you want. Each project can have a totally different layout.

If `sections` is empty, the project falls back to the classic layout (overview, challenge, process, results).

### Hiding individual sections of the classic layout
Add Boolean fields named `hideChallenge`, `hideProcess`, `hideResults` to the Project type. Toggle them on a project to hide that section without removing data.

### Custom Process / Results steps
Add JSON object fields:
- `process` → `[{ "title": "Research", "desc": "User interviews" }, …]`
- `results` → `[{ "value": 85, "suffix": "%", "label": "Completion" }, …]`

---

## 3. .env knobs (no code changes needed)

```
VITE_FEATURED_LIMIT="4"          # 1–10 featured projects on homepage
VITE_BLOG_LIMIT="3"              # blog cards on homepage

VITE_SPONSOR_ENABLED="true"      # master ads on/off
VITE_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"
VITE_ADSENSE_SLOT="1234567890"
```

After changing `.env`, restart the dev server (or redeploy).

---

## 4. Why your News wasn't showing earlier

The frontend was fetching content type `article`, but your Contentful type is `news`. Fixed — News page and the homepage's "Latest from the Blog" both now read from `news`.
