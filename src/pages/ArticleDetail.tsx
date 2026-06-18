import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState, useRef, ReactNode } from "react";
import { Linkedin, Instagram, Twitter, Facebook, Loader2 } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Layout } from "../components/layout/Layout";
import { SponsorSlot } from "../components/SponsorSlot";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

interface TOC { id: string; title: string; level: number; }

const fallback: Record<string, { title: string; category: string; publishedAt: string; image: string; content: string; readTime: string; tags: string[]; }> = {
  "future-ui-design-2026": {
    title: "The Future of UI Design in 2026",
    category: "Design Trends",
    publishedAt: "2026-03-15",
    image: "/placeholder.svg",
    readTime: "6 min read",
    tags: ["UI", "Trends", "AI"],
    content: `## Introduction\nExploring how AI and spatial computing are reshaping interface design.\n\n## What's Changing\nFrom adaptive layouts to context-aware components, the next wave is here.\n\n### Adaptive Layouts\nInterfaces respond to user intent.\n\n## Closing\nDesigners must prepare today.`,
  },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function extractPlainFromRich(node: any): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.content)) return node.content.map(extractPlainFromRich).join(" ");
  return "";
}

function richHeadings(doc: any): TOC[] {
  const out: TOC[] = [];
  if (!doc?.content) return out;
  doc.content.forEach((n: any) => {
    if (n.nodeType === "heading-2" || n.nodeType === "heading-3") {
      const title = extractPlainFromRich(n).trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      out.push({ id, title, level: n.nodeType === "heading-2" ? 2 : 3 });
    }
  });
  return out;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { items, loading } = useContentful("news", slug);
  const cms = items[0];
  const fb = slug ? fallback[slug] : undefined;
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [toc, setToc] = useState<TOC[]>([]);

  const body = cms?.body ?? cms?.overview;
  const isRich = body && typeof body === "object" && body.nodeType === "document";
  const isString = typeof body === "string";

  // Build TOC
  useEffect(() => {
    let headings: TOC[] = [];
    if (isRich) {
      headings = richHeadings(body);
    } else {
      const source = isString ? body : (fb?.content ?? "");
      source.split("\n").forEach((line: string) => {
        if (line.startsWith("## ")) {
          const title = line.replace("## ", "").trim();
          headings.push({ id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title, level: 2 });
        } else if (line.startsWith("### ")) {
          const title = line.replace("### ", "").trim();
          headings.push({ id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title, level: 3 });
        }
      });
    }
    setToc(headings);
    if (headings.length > 0) setActiveSection(headings[0].id);
  }, [cms?.id, slug]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const headingEls = contentRef.current.querySelectorAll("h2, h3");
      const scrollPos = window.scrollY + 150;
      let current = "";
      headingEls.forEach((h) => {
        const el = h as HTMLElement;
        if (el.offsetTop <= scrollPos) current = el.id;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  if (loading && !cms && !fb) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading article…
        </div>
      </Layout>
    );
  }

  if (!cms && !fb) return <Navigate to="/news" replace />;

  const title = cms?.title || fb!.title;
  const category = cms?.category || fb?.category || "News";
  const publishedAt = cms?.createdAt || fb!.publishedAt;
  const image = cms ? getImageUrl(cms.image) : fb!.image;
  const excerpt = cms?.excerpt;
  const tags: string[] = (cms?.tags as string[]) || fb?.tags || [];

  const plain = isRich ? extractPlainFromRich(body) : (isString ? body : (excerpt || fb?.content || ""));
  const readTime = estimateReadTime(plain);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };

  const renderStringContent = (text: string): ReactNode[] => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        const title = line.replace("## ", "").trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return <h2 key={index} id={id} className="font-display text-3xl md:text-4xl font-bold text-foreground mt-16 mb-6 scroll-mt-32">{title}</h2>;
      }
      if (line.startsWith("### ")) {
        const title = line.replace("### ", "").trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return <h3 key={index} id={id} className="font-display text-xl md:text-2xl font-semibold text-foreground mt-10 mb-4 scroll-mt-32">{title}</h3>;
      }
      if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        return <p key={index} className="font-semibold text-foreground my-4">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("- ")) {
        return <li key={index} className="text-muted-foreground ml-6 my-2 list-disc">{line.replace("- ", "")}</li>;
      }
      if (line.trim()) {
        return <p key={index} className="text-muted-foreground leading-relaxed my-4 text-lg">{line}</p>;
      }
      return null;
    });
  };

  return (
    <Layout>
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[240px]">{title}</span>
          </div>

          {/* Hero */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium mb-4">{category}</span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">{title}</h1>
              {excerpt && <p className="text-muted-foreground text-lg mb-6">{excerpt}</p>}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatDate(publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{readTime}</span>
              </div>
            </div>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Body with sidebar */}
          <div className="grid lg:grid-cols-4 gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                {toc.length > 0 && (
                  <>
                    <h4 className="text-sm font-bold text-foreground mb-6">In this article:</h4>
                    <nav className="space-y-1 border-l-2 border-border">
                      {toc.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={cn(
                            "block w-full text-left text-sm py-2 transition-all duration-200 border-l-2 -ml-0.5",
                            item.level === 3 ? "pl-8" : "pl-4",
                            activeSection === item.id
                              ? "text-primary border-primary font-medium"
                              : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground"
                          )}
                        >
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  </>
                )}

                <div className="mt-12 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Connect:</p>
                  <div className="flex items-center gap-3">
                    {[Linkedin, Instagram, Twitter, Facebook].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div ref={contentRef} className="lg:col-span-3 w-full">
              <article className="prose-custom">
                {isRich ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
                    {documentToReactComponents(body)}
                  </div>
                ) : isString ? (
                  renderStringContent(body)
                ) : (
                  renderStringContent(fb?.content || excerpt || "Add a `body` field (Long Text or Rich Text) to this entry in Contentful.")
                )}
              </article>

              {/* CTA */}
              <div className="mt-16 p-8 rounded-2xl bg-card border border-border">
                <div className="bg-secondary/50 p-6 rounded-xl">
                  <h4 className="font-bold text-foreground mb-2 font-display">Like what you read? Let's work together.</h4>
                  <Button asChild size="sm" className="mt-4 rounded-full">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>

              {/* Sponsor */}
              <div className="mt-12">
                <SponsorSlot storageKey={`sponsor-article-${slug}`} />
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap mt-12 pt-8 border-t border-border">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  {tags.map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
