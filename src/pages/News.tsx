import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { SponsorSlot } from "../components/SponsorSlot";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
}

const PER_PAGE = Math.max(1, Number(import.meta.env.VITE_NEWS_PER_PAGE) || 10);

const fallback: NewsPost[] = [
  { id: "1", slug: "future-ui-design-2026", title: "The Future of UI Design in 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design.", image: "/placeholder.svg", category: "Design Trends", publishedAt: "2026-03-15" },
  { id: "2", slug: "accessibility-non-negotiable", title: "Why Accessibility is Non-Negotiable", excerpt: "Making digital products inclusive isn't optional — it's essential.", image: "/placeholder.svg", category: "Best Practices", publishedAt: "2026-03-08" },
  { id: "3", slug: "wireframe-to-pixel-perfect", title: "From Wireframe to Pixel-Perfect", excerpt: "A deep dive into the design workflow that delivers consistent results.", image: "/placeholder.svg", category: "Process", publishedAt: "2026-02-28" },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

interface AdvancedFilters {
  exact: string;
  has: string;
  exclude: string;
  date: "any" | "24h" | "week" | "month" | "year";
}

const emptyFilters: AdvancedFilters = { exact: "", has: "", exclude: "", date: "any" };

function withinDate(iso: string, range: AdvancedFilters["date"]) {
  if (range === "any") return true;
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const day = 86400000;
  if (range === "24h") return diff <= day;
  if (range === "week") return diff <= 7 * day;
  if (range === "month") return diff <= 30 * day;
  if (range === "year") return diff <= 365 * day;
  return true;
}

export default function News() {
  const { items, loading } = useContentful("news");

  const cms: NewsPost[] = items.map((i) => ({
    id: i.id,
    slug: i.slug || i.id,
    title: i.title || "Untitled",
    excerpt: i.excerpt || "",
    image: getImageUrl((i as any).coverImage) !== "/placeholder.svg"
      ? getImageUrl((i as any).coverImage)
      : getImageUrl(i.image),
    category: i.category || "News",
    publishedAt: (i as any).publishedDate || i.createdAt,
  }));
  const blogPosts: NewsPost[] = cms.length > 0 ? cms : fallback;

  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AdvancedFilters>(emptyFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const exact = filters.exact.trim().toLowerCase();
    const has = filters.has.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const exclude = filters.exclude.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return blogPosts.filter((post) => {
      if (activeCategory !== "All" && post.category !== activeCategory) return false;
      const hay = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (exact && !hay.includes(exact)) return false;
      if (has.length && !has.every((w) => hay.includes(w))) return false;
      if (exclude.length && exclude.some((w) => hay.includes(w))) return false;
      if (!withinDate(post.publishedAt, filters.date)) return false;
      return true;
    });
  }, [blogPosts, activeCategory, searchQuery, filters]);

  const featuredPost = blogPosts[0];
  const popularPosts = blogPosts.slice(0, 3);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filteredPosts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const resetFilters = () => {
    setFilters(emptyFilters);
    setSearchQuery("");
    setActiveCategory("All");
    setPage(1);
  };

  const activeFilterCount =
    (filters.exact ? 1 : 0) + (filters.has ? 1 : 0) + (filters.exclude ? 1 : 0) + (filters.date !== "any" ? 1 : 0);

  return (
    <Layout>
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">News</span>
          </div>

          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">News</h1>
            <p className="text-muted-foreground max-w-md">
              Insights, updates, and stories from the studio.
            </p>
          </div>

          {/* Featured & Popular */}
          {featuredPost && (
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-foreground mb-6">Featured</h2>
                <Link to={`/news/${featuredPost.slug}`} className="group block relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-3">{featuredPost.category}</span>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(featuredPost.publishedAt)}</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{featuredPost.title}</h3>
                  </div>
                </Link>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary mb-6">Popular</h2>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link key={post.id} to={`/news/${post.slug}`} className={cn(
                      "block p-5 rounded-xl transition-all duration-300",
                      index === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:border-primary/50"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs", index === 0 ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatDate(post.publishedAt)}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs", index === 0 ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground")}>{post.category}</span>
                      </div>
                      <h4 className={cn("font-semibold leading-snug", index === 0 ? "text-primary-foreground" : "text-foreground")}>{post.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter & Search */}
          <div className="relative mb-12">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                  showAdvanced || activeFilterCount > 0 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
              <div className="flex-1 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setPage(1); }}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                      activeCategory === category ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Advanced search panel */}
            {showAdvanced && (
              <div className="mt-3 p-6 rounded-xl bg-card border border-border shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-semibold text-foreground">Narrow your search results</p>
                  <button onClick={() => setShowAdvanced(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {([
                    ["exact", "Exact phrase"],
                    ["has", "Has words"],
                    ["exclude", "Exclude words"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="text-xs text-muted-foreground">
                      {label}
                      <input
                        type="text"
                        value={filters[key] as string}
                        onChange={(e) => { setFilters({ ...filters, [key]: e.target.value }); setPage(1); }}
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                  ))}
                  <label className="text-xs text-muted-foreground">
                    Date
                    <select
                      value={filters.date}
                      onChange={(e) => { setFilters({ ...filters, date: e.target.value as AdvancedFilters["date"] }); setPage(1); }}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="any">Any time</option>
                      <option value="24h">Past 24 hours</option>
                      <option value="week">Past week</option>
                      <option value="month">Past month</option>
                      <option value="year">Past year</option>
                    </select>
                  </label>
                </div>
                <div className="flex items-center justify-end gap-3 mt-5">
                  <button onClick={resetFilters} className="text-sm text-primary hover:underline">Clear</button>
                  <Button size="sm" onClick={() => setShowAdvanced(false)} className="rounded-full">Done</Button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Posts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">All News</h2>
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"}
              </p>
            </div>

            {loading && paged.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] rounded-xl bg-secondary mb-4" />
                    <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
                    <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-4 bg-secondary rounded w-full" />
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No posts match your filters. <button onClick={resetFilters} className="text-primary hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paged.map((post) => (
                  <Link key={post.id} to={`/news/${post.slug}`} className="group">
                    <article className="h-full flex flex-col">
                      <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                        <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">{post.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mb-16" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    aria-current={n === currentPage ? "page" : undefined}
                    className={cn(
                      "min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-colors",
                      n === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}

          {/* Sponsor — moved to bottom */}
          <div className="mt-4">
            <SponsorSlot storageKey="sponsor-news-list" />
          </div>
        </div>
      </main>
    </Layout>
  );
}
