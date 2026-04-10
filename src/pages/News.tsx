import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { Link } from "react-router-dom";

const articles = [
  { title: "The Future of UI Design in 2026", category: "Design Trends", date: "Mar 15, 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design and what designers need to prepare for.", slug: "future-ui-design-2026", image: "/placeholder.svg" },
  { title: "Why Accessibility is Non-Negotiable", category: "Best Practices", date: "Mar 8, 2026", excerpt: "Making digital products inclusive isn't optional — it's essential for every user and every business.", slug: "accessibility-non-negotiable", image: "/placeholder.svg" },
  { title: "From Wireframe to Pixel-Perfect", category: "Process", date: "Feb 28, 2026", excerpt: "A deep dive into the design workflow that delivers consistent, high-quality results every time.", slug: "wireframe-to-pixel-perfect", image: "/placeholder.svg" },
  { title: "Design Systems That Scale", category: "Design Systems", date: "Feb 15, 2026", excerpt: "How to build and maintain a design system that grows with your product and team.", slug: "design-systems-that-scale", image: "/placeholder.svg" },
  { title: "The Psychology of Color in Digital Products", category: "Design Theory", date: "Feb 1, 2026", excerpt: "Understanding how color influences user behavior and decision-making in interfaces.", slug: "psychology-of-color", image: "/placeholder.svg" },
  { title: "Designing for Dark Mode", category: "UI Design", date: "Jan 20, 2026", excerpt: "Best practices and common pitfalls when implementing dark mode in your applications.", slug: "designing-for-dark-mode", image: "/placeholder.svg" },
];

export default function News() {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">News & Insights</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl">Thoughts on Design & Product Building</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Articles, insights, and perspectives on UI/UX design, product strategy, and the craft of building great digital experiences.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <AnimatedSection key={a.slug} delay={i * 0.08}>
                <Link to={`/news/${a.slug}`} className="group block h-full">
                  <article className="rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[16/9] bg-muted overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
