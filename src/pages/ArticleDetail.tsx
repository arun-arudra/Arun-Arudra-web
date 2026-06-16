import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { SponsorSlot } from "../components/SponsorSlot";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2, Clock, Share2, Calendar } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

const fallbackArticles: Record<string, { title: string; category: string; date: string; image: string; body: string }> = {
  "future-ui-design-2026": { title: "The Future of UI Design in 2026", category: "Design Trends", date: "Mar 15, 2026", image: "/placeholder.svg", body: "Exploring how AI and spatial computing are reshaping interface design. From adaptive layouts to context-aware components, the next wave of UI is here." },
  "accessibility-non-negotiable": { title: "Why Accessibility is Non-Negotiable", category: "Best Practices", date: "Mar 8, 2026", image: "/placeholder.svg", body: "Making digital products inclusive isn't optional — it's essential. Here's how we approach accessibility from day one of every project." },
  "wireframe-to-pixel-perfect": { title: "From Wireframe to Pixel-Perfect", category: "Process", date: "Feb 28, 2026", image: "/placeholder.svg", body: "A deep dive into the design workflow that delivers consistent results across every project." },
  "design-systems-that-scale": { title: "Design Systems That Scale", category: "Design Systems", date: "Feb 15, 2026", image: "/placeholder.svg", body: "How to build and maintain a design system that grows with your product and team." },
  "psychology-of-color": { title: "The Psychology of Color in Digital Products", category: "Design Theory", date: "Feb 1, 2026", image: "/placeholder.svg", body: "Understanding how color influences user behavior and decision-making in interfaces." },
  "designing-for-dark-mode": { title: "Designing for Dark Mode", category: "UI Design", date: "Jan 20, 2026", image: "/placeholder.svg", body: "Best practices and common pitfalls when implementing dark mode in your applications." },
};

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { items, loading } = useContentful("news", slug);
  const cms = items[0];
  const fb = slug ? fallbackArticles[slug] : undefined;

  if (loading && !fb && !cms) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading article…
        </div>
      </Layout>
    );
  }

  if (!cms && !fb) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">This article may have been moved or hasn't been published yet.</p>
          <Button asChild className="rounded-full mt-4"><Link to="/news">Back to News</Link></Button>
        </div>
      </Layout>
    );
  }

  const title = cms?.title || fb!.title;
  const category = cms?.category || fb?.category;
  const dateStr = cms
    ? new Date(cms.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : fb!.date;
  const image = cms ? getImageUrl(cms.image) : fb!.image;
  const excerpt = cms?.excerpt;

  // Determine body content + plain text for read-time
  const body = cms?.body ?? cms?.overview;
  let plain = "";
  if (typeof body === "string") plain = body;
  else if (body?.nodeType === "document") {
    const walk = (n: any): string => {
      if (!n) return "";
      if (typeof n.value === "string") return n.value;
      if (Array.isArray(n.content)) return n.content.map(walk).join(" ");
      return "";
    };
    plain = walk(body);
  } else if (excerpt) plain = excerpt;
  else if (fb) plain = fb.body;
  const readMin = estimateReadTime(plain);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* user cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Layout>
      {/* Hero with image background */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={image} alt="" aria-hidden className="w-full h-full object-cover opacity-30 blur-xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to News
          </Link>
          <AnimatedSection direction="up">
            {category && (
              <span className="inline-block text-primary font-medium mb-5 tracking-[0.2em] uppercase text-xs font-mono px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
                {category}
              </span>
            )}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">{title}</h1>
            {excerpt && (
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">{excerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground border-t border-border/40 pt-6">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {dateStr}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {readMin} min read</span>
              <button onClick={handleShare} className="ml-auto flex items-center gap-2 hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Hero image */}
      <section className="px-6 -mt-4 mb-16 md:mb-24">
        <AnimatedSection direction="scale">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-muted max-w-5xl mx-auto shadow-2xl ring-1 ring-border/30">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        </AnimatedSection>
      </section>

      {/* Article body */}
      <article className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection direction="up">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:font-display">
              {(() => {
                if (body && typeof body === "object" && body.nodeType === "document") {
                  return documentToReactComponents(body);
                }
                if (typeof body === "string" && body.trim()) {
                  return body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>);
                }
                if (excerpt) return <p>{excerpt}</p>;
                if (!cms && fb) return <p>{fb.body}</p>;
                return (
                  <p className="text-muted-foreground italic">
                    Add a <code>body</code> field (Long Text) to this News entry in Contentful to fill in the article.
                  </p>
                );
              })()}
            </div>
          </AnimatedSection>

          {/* Sponsor (toggle off site-wide with VITE_SPONSOR_ENABLED="false") */}
          <AnimatedSection direction="up" className="mt-16">
            <SponsorSlot storageKey={`sponsor-article-${slug}`} />
          </AnimatedSection>

          {/* Footer / next steps */}
          <AnimatedSection direction="up" className="mt-16 pt-10 border-t border-border/40">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/news"><ArrowLeft className="mr-2 h-4 w-4" /> All Articles</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/contact">Work With Us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </article>
    </Layout>
  );
}
