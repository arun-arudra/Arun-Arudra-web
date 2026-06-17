import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
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

const fallback: NewsPost[] = [
  { id: "1", slug: "future-ui-design-2026", title: "The Future of UI Design in 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design.", image: "/placeholder.svg", category: "Design Trends", publishedAt: "2026-03-15" },
  { id: "2", slug: "accessibility-non-negotiable", title: "Why Accessibility is Non-Negotiable", excerpt: "Making digital products inclusive isn't optional — it's essential.", image: "/placeholder.svg", category: "Best Practices", publishedAt: "2026-03-08" },
  { id: "3", slug: "wireframe-to-pixel-perfect", title: "From Wireframe to Pixel-Perfect", excerpt: "A deep dive into the design workflow that delivers consistent results.", image: "/placeholder.svg", category: "Process", publishedAt: "2026-02-28" },
  { id: "4", slug: "design-systems-that-scale", title: "Design Systems That Scale", excerpt: "How to build a design system that grows with your product.", image: "/placeholder.svg", category: "Design Systems", publishedAt: "2026-02-15" },
  { id: "5", slug: "psychology-of-color", title: "The Psychology of Color in Digital Products", excerpt: "Understanding how color influences user behavior.", image: "/placeholder.svg", category: "Design Theory", publishedAt: "2026-02-01" },
  { id: "6", slug: "designing-for-dark-mode", title: "Designing for Dark Mode", excerpt: "Best practices and common pitfalls when implementing dark mode.", image: "/placeholder.svg", category: "UI Design", publishedAt: "2026-01-20" },
];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function News() {
  const { items, loading } = useContentful("news");
  const cms: NewsPost[] = items.map((i) => ({
    id: i.id,
    slug: i.slug || i.id,
    title: i.title || "Untitled",
    excerpt: i.excerpt || "",
    image: getImageUrl(i.image),
    category: i.category || "News",
    publishedAt: i.createdAt,
  }));
  const blogPosts: NewsPost[] = cms.length > 0 ? cms : (loading ? fallback : fallback);

  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];
  const popularPosts = blogPosts.slice(0, 3);
  const recentPosts = filteredPosts.slice(1);

  return (
    <Layout>
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Blog</span>
          </div>

          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Blog & Articles
            </h1>
            <p className="text-muted-foreground max-w-md">
              Welcome to our blog, where you'll find a treasure trove of valuable insights and news.
            </p>
          </div>

          {/* Featured & Popular */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-foreground mb-6">Featured Post</h2>
              <Link
                to={`/news/${featuredPost.slug}`}
                className="group block relative aspect-[16/10] rounded-2xl overflow-hidden"
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-3">
                    {featuredPost.category}
                  </span>
                  <p className="text-sm text-muted-foreground mb-2">{formatDate(featuredPost.publishedAt)}</p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                </div>
              </Link>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-6">Popular News</h2>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/news/${post.slug}`}
                    className={cn(
                      "block p-5 rounded-xl transition-all duration-300",
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("text-xs", index === 0 ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {formatDate(post.publishedAt)}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          index === 0
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h4
                      className={cn(
                        "font-semibold leading-snug",
                        index === 0 ? "text-primary-foreground" : "text-foreground"
                      )}
                    >
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl bg-card border border-border mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeCategory === category
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Sponsor */}
          <div className="mb-12">
            <SponsorSlot storageKey="sponsor-news-list" />
          </div>

          {/* Recent Posts */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.id} to={`/news/${post.slug}`} className="group">
                  <article className="h-full flex flex-col">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                      <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {recentPosts.length >= 6 && (
            <div className="text-center">
              <Button size="lg" className="rounded-full">Load More</Button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
