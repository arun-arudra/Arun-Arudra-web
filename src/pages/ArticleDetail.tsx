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
  "saas-dashboard-design-guide": {
    title: "How to Design a SaaS Dashboard Users Actually Understand",
    category: "UI/UX",
    publishedAt: "2026-08-01",
    image: "/placeholder.svg",
    readTime: "8 min read",
    tags: ["SaaS", "Dashboard", "UI Design", "Figma"],
    content: `## Introduction\nMost SaaS dashboards fail users not because of missing features — but because they display too much, too soon, without hierarchy.\n\n## The Core Problem\nWhen everything is equally visible, nothing is important. Users open the dashboard, see 15 metrics, 4 charts, and 3 sidebars — and freeze.\n\n### What Good Dashboard Design Looks Like\nPrioritize the one number that tells users if their day is going well or not. Everything else is secondary.\n\n## The Fix\nStart with user goals, not data availability. Ask: what decision does this screen need to enable?\n\n## Closing\nA great dashboard is not one that shows everything — it's one that shows the right thing at the right time.`,
  },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function estimateReadTime(text: string): string {
  const stripped = text.replace(/<[^>]+>/g, " ");
  const words = stripped.trim().split(/\s+/).length;
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


// Markdown → HTML converter for article body rendering
function markdownToHtml(md: string): string {
  if (!md || typeof md !== 'string') return '';
  if (/^\s*<[a-zA-Z]/.test(md)) return md;
  let html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/((?:^[-*+] .+\n?)+)/gm, (match: string) => {
    const items = match.trim().split('\n').filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^[-*+]\s+/, '').trim()}</li>`).join('');
    return `<ul>${items}</ul>\n`;
  });
  html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, (match: string) => {
    const items = match.trim().split('\n').filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^\d+\.\s+/, '').trim()}</li>`).join('');
    return `<ol>${items}</ol>\n`;
  });
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---+$/gm, '<hr>');
  const blocks = html.split(/\n\n+/);
  html = blocks.map((block: string) => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|blockquote|hr|div|p)/.test(block)) return block;
    block = block.replace(/\n/g, '<br>');
    return `<p>${block}</p>`;
  }).filter(Boolean).join('\n');
  return html;
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
  const isHtml = isString && /^\s*<[a-zA-Z]/.test(body as string);

  // Build TOC
  useEffect(() => {
    let headings: TOC[] = [];
    if (isRich) {
      headings = richHeadings(body);
    } else if (isHtml) {
      // Parse <h2> and <h3> tags from HTML string
      const hMatches = (body as string).matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi);
      for (const m of hMatches) {
        const level = parseInt(m[1]);
        const title = m[2].replace(/<[^>]+>/g, "").trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        headings.push({ id, title, level });
      }
    } else {
      const source = isString ? body : (fb?.content ?? "");
      (source as string).split("\n").forEach((line: string) => {
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

  // Assign IDs to headings when HTML body is rendered
  useEffect(() => {
    if (!contentRef.current || !isHtml) return;
    const headingEls = contentRef.current.querySelectorAll("h2, h3");
    headingEls.forEach((h) => {
      const title = h.textContent?.trim() || "";
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      h.setAttribute("id", id);
    });
  }, [body, isHtml]);

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
            <Link to="/news" className="hover:text-foreground transition-colors">News</Link>
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
                ) : isHtml ? (
                  <div
                    ref={contentRef}
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4 prose-p:leading-relaxed prose-p:text-lg prose-li:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: body as string }}
                  />
                ) : isString ? (
                  renderStringContent(body as string)
                ) : (
                  renderStringContent(fb?.content || excerpt || "Add a body field (Long Text or Rich Text) to this entry in Contentful.")
                )}
              </article>

              {/* CTA */}
              <div className="mt-16 p-8 rounded-2xl bg-card border border-border">
                <div className="bg-secondary/50 p-6 rounded-xl">
                  <h4 className="font-bold text-foreground mb-2 font-display">Need help applying this to your product?</h4>
                  <p className="text-muted-foreground text-sm mb-4">I help startups and growing businesses design and build digital products people love. Let's talk about yours.</p>
                  <Button asChild size="sm" className="mt-2 rounded-full">
                    <Link to="/contact">Book a Free Call</Link>
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
