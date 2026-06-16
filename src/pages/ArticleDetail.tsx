import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { SponsorSlot } from "../components/SponsorSlot";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

// Fallback demo articles — used when an article slug isn't in Contentful yet.
const fallbackArticles: Record<string, { title: string; category: string; date: string; image: string; body: string }> = {
  "future-ui-design-2026": {
    title: "The Future of UI Design in 2026",
    category: "Design Trends",
    date: "Mar 15, 2026",
    image: "/placeholder.svg",
    body: "Exploring how AI and spatial computing are reshaping interface design. From adaptive layouts to context-aware components, the next wave of UI is here.",
  },
  "accessibility-non-negotiable": {
    title: "Why Accessibility is Non-Negotiable",
    category: "Best Practices",
    date: "Mar 8, 2026",
    image: "/placeholder.svg",
    body: "Making digital products inclusive isn't optional — it's essential. Here's how we approach accessibility from day one of every project.",
  },
  "wireframe-to-pixel-perfect": {
    title: "From Wireframe to Pixel-Perfect",
    category: "Process",
    date: "Feb 28, 2026",
    image: "/placeholder.svg",
    body: "A deep dive into the design workflow that delivers consistent results across every project, regardless of scope or industry.",
  },
  "design-systems-that-scale": {
    title: "Design Systems That Scale",
    category: "Design Systems",
    date: "Feb 15, 2026",
    image: "/placeholder.svg",
    body: "How to build and maintain a design system that grows with your product and team.",
  },
  "psychology-of-color": {
    title: "The Psychology of Color in Digital Products",
    category: "Design Theory",
    date: "Feb 1, 2026",
    image: "/placeholder.svg",
    body: "Understanding how color influences user behavior and decision-making in interfaces.",
  },
  "designing-for-dark-mode": {
    title: "Designing for Dark Mode",
    category: "UI Design",
    date: "Jan 20, 2026",
    image: "/placeholder.svg",
    body: "Best practices and common pitfalls when implementing dark mode in your applications.",
  },
};

export default function ArticleDetail() {
  const { slug } = useParams();
  // Content type ID in Contentful is "news"
  const { items, loading } = useContentful("news", slug);
  const cms = items[0];
  const fb = slug ? fallbackArticles[slug] : undefined;

  if (loading && !fb) {
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

  return (
    <Layout>
      <article className="pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to News
          </Link>
          <AnimatedSection direction="up">
            {category && (
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">{category}</p>
            )}
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">{title}</h1>
            <p className="text-muted-foreground text-sm mb-10">{dateStr}</p>
          </AnimatedSection>

          <AnimatedSection direction="up" className="mb-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </AnimatedSection>

          {/* Minimal in-article sponsor (toggle off site-wide with VITE_SPONSOR_ENABLED="false") */}
          <AnimatedSection direction="up" className="mb-10">
            <SponsorSlot storageKey={`sponsor-article-${slug}`} />
          </AnimatedSection>

          <AnimatedSection direction="up">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary">
              {(() => {
                const body = cms?.body ?? cms?.overview;
                // Rich text (Contentful JSON) has nodeType === "document"
                if (body && typeof body === "object" && body.nodeType === "document") {
                  return documentToReactComponents(body);
                }
                if (typeof body === "string" && body.trim()) {
                  return body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>);
                }
                if (cms?.excerpt) return <p>{cms.excerpt}</p>;
                if (!cms && fb) return <p>{fb.body}</p>;
                return (
                  <p className="text-muted-foreground italic">
                    No body content yet. Add a <code>body</code> (Rich Text or Long Text) field to this article in Contentful.
                  </p>
                );
              })()}
            </div>
          </AnimatedSection>
        </div>
      </article>
    </Layout>
  );
}
