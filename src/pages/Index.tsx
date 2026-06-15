import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { MorphingBlob } from "../components/MorphingBlob";
import { MagneticButton } from "../components/MagneticButton";
import { SplitTextReveal } from "../components/SplitTextReveal";
import { TextScramble } from "../components/TextScramble";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { MarqueeText } from "../components/MarqueeText";
import { LogoMarquee } from "../components/LogoMarquee";
import { ProjectListItem } from "../components/ProjectListItem";
// CaseStudyCarousel removed — section hidden per request
import { ArrowRight, CheckCircle2, MessageSquareQuote, Eye, Zap, Gem, Rocket } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useContentful, getImageUrl } from "@/hooks/useContentful";
import { siteConfig } from "@/config/site";

const trustPoints = [
  "User-First Design",
  "Conversion Focused",
  "Pixel-Perfect Delivery",
];

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 12, suffix: "+", label: "Industries Served" },
  { value: 3, suffix: "x", label: "Avg. Conversion Lift" },
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
  { title: "Silver Club", slug: "silver-club", tags: ["Mobile App", "UX Research", "UI Design"], image: "/images/projects/silver-club.jpg", number: "01" },
  { title: "HealthTrack", slug: "healthtrack", tags: ["Web Platform", "Dashboard", "Data Viz"], image: "/images/projects/healthtrack.jpg", number: "02" },
  { title: "EcoMart", slug: "ecomart", tags: ["E-commerce", "Branding", "Product Design"], image: "/images/projects/ecomart.jpg", number: "03" },
];

// caseStudies array removed — section hidden per request

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

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <MorphingBlob />
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-5xl">
          <AnimatedSection direction="none">
            <TextScramble className="text-primary font-medium mb-6 tracking-wider uppercase text-sm block font-mono" delay={0.2}>
              Design Agency
            </TextScramble>
          </AnimatedSection>

          <SplitTextReveal
            as="h1"
            delay={0.3}
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-bold leading-[1.02] mb-8 tracking-tight"
          >
            {"We Build Digital\nThat Converts"}
          </SplitTextReveal>

          <AnimatedSection delay={0.7}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              ArunArudra helps startups and brands build products people love through strategic design, user-first thinking, and pixel-perfect execution.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.9}>
            <div className="flex flex-wrap gap-4 mb-10">
              <MagneticButton>
                <Button size="lg" className="rounded-full px-8 text-base h-14" asChild>
                  <Link to="/projects">
                    View Our Work <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-14" asChild>
                  <Link to="/contact">Book a Call</Link>
                </Button>
              </MagneticButton>
            </div>
            <div className="flex flex-wrap gap-6">
              {trustPoints.map((t) => (
                <span key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                </span>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={1.1}>
            <div className="mt-12 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 max-w-md">
              <MessageSquareQuote className="h-5 w-5 text-primary mb-3" />
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "ArunArudra transformed our product from a clunky MVP into something our users genuinely love. The attention to detail is unmatched."
              </p>
              <p className="text-xs font-medium mt-3 text-foreground/80">— Sarah Chen, CEO at Pulse AI</p>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-20 border-y border-border/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1} direction="up">
              <div className="text-center">
                <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection direction="left">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">What We Do</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-muted-foreground max-w-xl mb-16">Strategic design services that help brands stand out and products succeed.</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden">
          {serviceBlocks.map((s, i) => (
            <AnimatedSection key={s.number} delay={i * 0.12} direction="up">
              <div className="bg-card p-8 md:p-10 h-full group hover:bg-primary/5 transition-colors duration-500 relative overflow-hidden">
                <span className="text-primary/10 font-display text-[8rem] font-bold absolute -top-8 -right-4 leading-none select-none">{s.number}</span>
                <div className="relative z-10">
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
  );
}

function FeaturedProjectsSection() {
  const { items } = useContentful("project");
  const limit = Math.min(Math.max(siteConfig.featuredProjectsLimit, 1), 10);
  // Prefer projects explicitly marked featured in Contentful; otherwise fall
  // back to the top of the sorted list (still respects `order` field).
  const cmsList = items.filter((i) => i.featured);
  const cmsSource = cmsList.length > 0 ? cmsList : items;
  const cmsFeatured = cmsSource.slice(0, limit).map((i) => ({
    title: i.title || "Untitled",
    slug: i.slug || i.id,
    tags: Array.isArray(i.tags) ? i.tags : (i.category ? [i.category] : ["Case Study"]),
    image: getImageUrl(i.image),
  }));
  const list = cmsFeatured.length > 0 ? cmsFeatured : featuredProjects.slice(0, limit);
  const numbered = list.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <AnimatedSection direction="left">
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Selected Work</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Featured Projects</h2>
            </AnimatedSection>
          </div>
          <AnimatedSection direction="right" className="hidden md:block">
            <MagneticButton>
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/projects">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>

        <div className="border-t border-border/30">
          {numbered.map((p) => (
            <ProjectListItem key={p.slug} {...p} />
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-10 text-center md:hidden">
          <MagneticButton>
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/projects">Explore All Work <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </MagneticButton>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <div className="py-12 border-y border-border/20 overflow-hidden">
      <MarqueeText
        text="Strategy · Design · Development · Branding · UX Research · Motion Design"
        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground/5"
        speed={30}
        separator="✦"
      />
    </div>
  );
}

function WhyUsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Why ArunArudra</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">Why Brands Choose Us</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          {whyUs.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1} direction="up">
              <div className="p-8 md:p-10 rounded-2xl border border-border/50 bg-card group relative overflow-hidden hover:border-primary/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const { items } = useContentful("article");
  const cms = items.slice(0, siteConfig.latestBlogLimit).map((i) => ({
    title: i.title || "Untitled",
    slug: i.slug || i.id,
    category: i.category || "Article",
    date: new Date(i.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    excerpt: i.excerpt || "",
    image: getImageUrl(i.image),
  }));
  const list = cms.length > 0 ? cms : latestNews.slice(0, siteConfig.latestBlogLimit);

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container mx-auto px-6">
        <AnimatedSection direction="left">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Insights</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">Latest from the Blog</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {list.map((n, i) => (
            <AnimatedSection key={n.slug} delay={i * 0.1} direction="up">
              <Link to={`/news/${n.slug}`} className="group block h-full">
                <article className="rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    <img src={n.image} alt={n.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-6 flex flex-col flex-1 relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wider font-mono">{n.category}</span>
                    <h3 className="font-display text-lg font-semibold mt-3 mb-2 group-hover:text-primary transition-colors leading-snug">{n.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">{n.excerpt}</p>
                    <span className="text-xs text-muted-foreground mt-auto">{n.date}</span>
                  </div>
                </article>
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
  );
}

function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <AnimatedSection direction="scale">
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm font-mono">Let's Build Something Great</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ready to Accelerate<br />Your Growth?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg">
            From concept to launch, we'll bring your vision to life with strategic design that drives real results.
          </p>
          <MagneticButton>
            <Button size="lg" className="rounded-full px-10 text-base h-14" asChild>
              <Link to="/contact">Book a Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </MagneticButton>
        </AnimatedSection>
      </div>
    </section>
  );
}

import { SectionIndicator } from "../components/SectionIndicator";

const sections = [
  { id: "sec-hero", label: "Intro" },
  { id: "sec-logos", label: "Trusted by" },
  { id: "sec-stats", label: "Impact" },
  { id: "sec-services", label: "Services" },
  { id: "sec-projects", label: "Work" },
  { id: "sec-why", label: "Why us" },
  { id: "sec-news", label: "News" },
  { id: "sec-cta", label: "Connect" },
];

export default function Index() {
  return (
    <Layout>
      <SectionIndicator sections={sections} />
      <div id="sec-hero"><HeroSection /></div>
      <div id="sec-logos"><LogoMarquee /></div>
      <div id="sec-stats"><StatsSection /></div>
      <div id="sec-services"><ServicesSection /></div>
      <MarqueeSection />
      <div id="sec-projects"><FeaturedProjectsSection /></div>
      <div id="sec-why"><WhyUsSection /></div>
      <div id="sec-news"><NewsSection /></div>
      <div id="sec-cta"><CTASection /></div>
    </Layout>
  );
}

