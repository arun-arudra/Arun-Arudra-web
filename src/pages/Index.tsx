import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { MorphingBlob } from "../components/MorphingBlob";
import { ArrowRight, Palette, Monitor, Smartphone, PenTool, Layers } from "lucide-react";
import { Button } from "../components/ui/button";

const services = [
  { icon: Palette, title: "UI/UX Design", desc: "Crafting intuitive, user-centered interfaces that delight and convert." },
  { icon: Monitor, title: "Website Design", desc: "Responsive, fast-loading websites that rank and perform." },
  { icon: Smartphone, title: "Product Design", desc: "End-to-end digital product design from concept to launch." },
  { icon: PenTool, title: "Branding", desc: "Visual identity systems that make your brand unforgettable." },
];

const featuredProjects = [
  { title: "Silver Club", category: "Mobile App", summary: "Designing a social space for people aged 45+", slug: "silver-club", image: "/placeholder.svg" },
  { title: "HealthTrack", category: "Web Platform", summary: "Reimagining healthcare management for patients and providers", slug: "healthtrack", image: "/placeholder.svg" },
  { title: "EcoMart", category: "E-commerce", summary: "Sustainable shopping experience with zero-waste focus", slug: "ecomart", image: "/placeholder.svg" },
];

const latestNews = [
  { title: "The Future of UI Design in 2026", category: "Design Trends", date: "Mar 15, 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design.", slug: "future-ui-design-2026" },
  { title: "Why Accessibility is Non-Negotiable", category: "Best Practices", date: "Mar 8, 2026", excerpt: "Making digital products inclusive isn't optional — it's essential for every user.", slug: "accessibility-non-negotiable" },
  { title: "From Wireframe to Pixel-Perfect", category: "Process", date: "Feb 28, 2026", excerpt: "A deep dive into the design workflow that delivers consistent results.", slug: "wireframe-to-pixel-perfect" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <MorphingBlob />
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection>
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">UI/UX Designer & Product Designer</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 max-w-4xl">
              Crafting Digital<br />
              Experiences That<br />
              <span className="text-gradient">Inspire & Convert</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8">
              I'm Arun, founder of ArunArudra — helping startups and brands build products people love through strategic design and user-first thinking.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 text-base" asChild>
                <Link to="/projects">View Projects <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">What I Do</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Services</h2>
            <p className="text-muted-foreground max-w-xl mb-12">Strategic design services that help brands stand out and products succeed in the digital landscape.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.4}>
            <div className="mt-10 text-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/services">All Services <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Selected Work</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-xl mb-12">Explore case studies from brands and startups I've helped transform through design.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.1}>
                <Link to={`/projects/${p.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="text-muted-foreground text-sm">{p.summary}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.3}>
            <div className="mt-10 text-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/projects">View All Projects <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Insights</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Latest News</h2>
            <p className="text-muted-foreground max-w-xl mb-12">Thoughts on design, product thinking, and building digital experiences that matter.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((n, i) => (
              <AnimatedSection key={n.slug} delay={i * 0.1}>
                <Link to={`/news/${n.slug}`} className="group block">
                  <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{n.category}</span>
                    <h3 className="font-display text-lg font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{n.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{n.excerpt}</p>
                    <span className="text-xs text-muted-foreground">{n.date}</span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.3}>
            <div className="mt-10 text-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/news">Read All Articles <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <Layers className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's collaborate to create something extraordinary. From concept to launch, I'll bring your vision to life.</p>
            <Button size="lg" className="rounded-full px-10 text-base" asChild>
              <Link to="/contact">Let's Talk <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
