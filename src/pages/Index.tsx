import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { MorphingBlob } from "../components/MorphingBlob";
import { MagneticButton } from "../components/MagneticButton";
import { TextReveal } from "../components/TextReveal";
import { LogoMarquee } from "../components/LogoMarquee";
import { ProjectCard } from "../components/ProjectCard";
import { ArrowRight, CheckCircle2, MessageSquareQuote, Eye, Zap, Gem, Rocket } from "lucide-react";
import { Button } from "../components/ui/button";

const trustPoints = [
  "User-First Design",
  "Conversion Focused",
  "Pixel-Perfect Delivery",
];

const serviceBlocks = [
  {
    number: "01",
    title: "Strategy",
    desc: "We uncover what your users need and align it with your business goals — before design begins.",
    subs: ["Market Research", "Brand Positioning", "Product Strategy", "UX Audits"],
  },
  {
    number: "02",
    title: "Design",
    desc: "From wireframes to polished interfaces, we craft every pixel with purpose and precision.",
    subs: ["UI/UX Design", "Brand Identity", "Motion Design", "Design Systems"],
  },
  {
    number: "03",
    title: "Delivery",
    desc: "We don't just design — we ensure flawless handoff, QA support, and post-launch optimization.",
    subs: ["Dev Handoff", "Frontend Support", "Performance", "Analytics"],
  },
];

const featuredProjects = [
  { title: "Silver Club", slug: "silver-club", tags: ["Mobile App", "UX Research", "UI Design"], image: "/placeholder.svg" },
  { title: "HealthTrack", slug: "healthtrack", tags: ["Web Platform", "Dashboard", "Data Viz"], image: "/placeholder.svg" },
  { title: "EcoMart", slug: "ecomart", tags: ["E-commerce", "Branding", "Product Design"], image: "/placeholder.svg" },
];

const whyUs = [
  { icon: Eye, title: "Always in the Loop", desc: "Transparent communication with regular updates, shared workspaces, and no black-box processes." },
  { icon: Gem, title: "Your Vision, Our Expertise", desc: "We don't impose — we listen, challenge, and elevate your ideas into something extraordinary." },
  { icon: Zap, title: "Efficiency That Matches Pace", desc: "Lean team, fast iterations, and a process built for startups that move quickly." },
  { icon: Rocket, title: "Built for Long-Term Success", desc: "Scalable design systems and strategic thinking that grow with your product." },
];

const latestNews = [
  { title: "The Future of UI Design in 2026", category: "Design Trends", date: "Mar 15, 2026", excerpt: "Exploring how AI and spatial computing are reshaping interface design.", slug: "future-ui-design-2026", image: "/placeholder.svg" },
  { title: "Why Accessibility is Non-Negotiable", category: "Best Practices", date: "Mar 8, 2026", excerpt: "Making digital products inclusive isn't optional — it's essential.", slug: "accessibility-non-negotiable", image: "/placeholder.svg" },
  { title: "From Wireframe to Pixel-Perfect", category: "Process", date: "Feb 28, 2026", excerpt: "A deep dive into the design workflow that delivers consistent results.", slug: "wireframe-to-pixel-perfect", image: "/placeholder.svg" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <MorphingBlob />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSection direction="none">
                <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">Design Agency</p>
              </AnimatedSection>
              <AnimatedSection delay={0.1} direction="none">
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
                  <TextReveal as="span" delay={0.15} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05]">
                    We Build Digital
                  </TextReveal>
                  <br />
                  <span className="text-gradient">
                    <TextReveal as="span" delay={0.4} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-gradient">
                      That Converts
                    </TextReveal>
                  </span>
                </h1>
              </AnimatedSection>
              <AnimatedSection delay={0.5}>
                <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8">
                  ArunArudra helps startups and brands build products people love through strategic design, user-first thinking, and pixel-perfect execution.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.6}>
                <div className="flex flex-wrap gap-4 mb-8">
                  <MagneticButton>
                    <Button size="lg" className="rounded-full px-8 text-base" asChild>
                      <Link to="/projects">View Our Work <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button size="lg" variant="outline" className="rounded-full px-8 text-base" asChild>
                      <Link to="/contact">Book a Call</Link>
                    </Button>
                  </MagneticButton>
                </div>
                {/* Trust checkmarks */}
                <div className="flex flex-wrap gap-4">
                  {trustPoints.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
              {/* Testimonial */}
              <AnimatedSection delay={0.8}>
                <div className="mt-10 p-5 rounded-xl bg-card border border-border/50 max-w-md">
                  <MessageSquareQuote className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "ArunArudra transformed our product from a clunky MVP into something our users genuinely love. The attention to detail is unmatched."
                  </p>
                  <p className="text-xs font-medium mt-3">— Sarah Chen, CEO at Pulse AI</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <LogoMarquee />

      {/* Services Preview */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">What We Do</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Services</h2>
            <p className="text-muted-foreground max-w-xl mb-16">Strategic design services that help brands stand out and products succeed.</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden">
            {serviceBlocks.map((s, i) => (
              <AnimatedSection key={s.number} delay={i * 0.12} direction="up">
                <div className="bg-card p-8 md:p-10 h-full group hover:bg-primary/5 transition-colors duration-500">
                  <span className="text-primary/20 font-display text-6xl md:text-7xl font-bold">{s.number}</span>
                  <h3 className="font-display text-2xl font-bold mt-4 mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.subs.map((sub) => (
                      <li key={sub} className="text-sm text-muted-foreground/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" /> {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="mt-10 text-center">
              <MagneticButton>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/services">Explore All Services <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="right">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Selected Work</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-xl mb-16">Case studies from brands and startups we've helped transform through strategic design.</p>
          </AnimatedSection>

          <div className="space-y-12">
            {featuredProjects.map((p, i) => (
              <ProjectCard key={p.slug} {...p} index={i} />
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-14 text-center">
              <MagneticButton>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/projects">Explore All Work <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Why ArunArudra</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">Why Brands Choose Us</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1} direction="up">
                <div className="p-8 md:p-10 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Insights</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">Latest from the Blog</h2>
          </AnimatedSection>

          {/* Featured article */}
          <AnimatedSection direction="up">
            <Link to={`/news/${latestNews[0].slug}`} className="group block mb-8">
              <div className="relative rounded-2xl overflow-hidden border border-border/50">
                <div className="aspect-[21/9] bg-muted overflow-hidden">
                  <img src={latestNews[0].image} alt={latestNews[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end p-8 md:p-12">
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{latestNews[0].category}</span>
                    <h3 className="font-display text-2xl md:text-4xl font-bold mt-2 group-hover:text-primary transition-colors">{latestNews[0].title}</h3>
                    <p className="text-muted-foreground mt-2 max-w-lg">{latestNews[0].excerpt}</p>
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Smaller articles */}
          <div className="grid md:grid-cols-2 gap-6">
            {latestNews.slice(1).map((n, i) => (
              <AnimatedSection key={n.slug} delay={i * 0.1} direction="up">
                <Link to={`/news/${n.slug}`} className="group block">
                  <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-300">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{n.category}</span>
                    <h3 className="font-display text-lg font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{n.title}</h3>
                    <p className="text-muted-foreground text-sm">{n.excerpt}</p>
                    <span className="text-xs text-muted-foreground mt-3 block">{n.date}</span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-10 text-center">
              <MagneticButton>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/news">Read All Articles <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">Let's Build Something Great</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">Ready to Accelerate<br />Your Growth?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">From concept to launch, we'll bring your vision to life with strategic design that drives real results.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base" asChild>
                <Link to="/contact">Book a Call <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
