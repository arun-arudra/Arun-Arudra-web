import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { SponsorSlot } from "../components/SponsorSlot";
import { Link } from "react-router-dom";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

const fallback = [
  { title: "The Future of UI Design in 2026", category: "Design Trends", date: "Mar 15, 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design and what designers need to prepare for.", slug: "future-ui-design-2026", image: "/placeholder.svg" },
  { title: "Why Accessibility is Non-Negotiable", category: "Best Practices", date: "Mar 8, 2026", excerpt: "Making digital products inclusive isn't optional — it's essential for every user and every business.", slug: "accessibility-non-negotiable", image: "/placeholder.svg" },
  { title: "From Wireframe to Pixel-Perfect", category: "Process", date: "Feb 28, 2026", excerpt: "A deep dive into the design workflow that delivers consistent, high-quality results every time.", slug: "wireframe-to-pixel-perfect", image: "/placeholder.svg" },
  { title: "Design Systems That Scale", category: "Design Systems", date: "Feb 15, 2026", excerpt: "How to build and maintain a design system that grows with your product and team.", slug: "design-systems-that-scale", image: "/placeholder.svg" },
  { title: "The Psychology of Color in Digital Products", category: "Design Theory", date: "Feb 1, 2026", excerpt: "Understanding how color influences user behavior and decision-making in interfaces.", slug: "psychology-of-color", image: "/placeholder.svg" },
  { title: "Designing for Dark Mode", category: "UI Design", date: "Jan 20, 2026", excerpt: "Best practices and common pitfalls when implementing dark mode in your applications.", slug: "designing-for-dark-mode", image: "/placeholder.svg" },
];

export default function News() {
  const { items } = useContentful("article");
  const cms = items.map((i) => ({
    title: i.title || "Untitled",
    slug: i.slug || i.id,
    category: i.category || "Article",
    date: new Date(i.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    excerpt: i.excerpt || "",
    image: getImageUrl(i.image),
  }));
  const articles = [...cms, ...fallback];
  const [featured, ...rest] = articles;

  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Blog & Insights</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl">Thoughts on Design & Product Building</h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          {/* Featured article */}
          <AnimatedSection direction="up" className="mb-10">
            <Link to={`/news/${featured.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-border/50">
                <div className="aspect-[21/9] bg-muted overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end p-8 md:p-12">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">{featured.category}</span>
                      <span className="text-xs text-muted-foreground">{featured.date}</span>
                    </div>
                    <h2 className="font-display text-2xl md:text-4xl font-bold group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-muted-foreground mt-2 max-w-lg">{featured.excerpt}</p>
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Sponsor slot — minimal, dismissible, news-only */}
          <AnimatedSection direction="up" className="mb-10">
            <SponsorSlot storageKey="sponsor-news-list" />
          </AnimatedSection>

          {/* Offset grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((a, i) => (
              <AnimatedSection key={a.slug} delay={i * 0.08} direction="up" className={i % 3 === 0 ? "md:translate-y-8" : ""}>
                <Link to={`/news/${a.slug}`} className="group block h-full">
                  <article className="rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[16/9] bg-muted overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">{a.category}</span>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{a.excerpt}</p>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
