import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { SplitTextReveal } from "../components/SplitTextReveal";
import { MagneticButton } from "../components/MagneticButton";
import { MarqueeText } from "../components/MarqueeText";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowLeft, Target, Lightbulb, Palette, Code, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useContentful, getImageUrl } from "@/hooks/useContentful";
import { ProjectBlocks } from "../components/ProjectBlocks";

const projectsData: Record<string, {
  title: string;
  subtitle: string;
  tags: string[];
  overview: string;
  challenge: string;
  process: { icon: typeof Target; title: string; desc: string }[];
  results: { value: number; suffix: string; label: string }[];
}> = {
  "silver-club": {
    title: "Silver Club",
    subtitle: "Designing a social space for people aged 45+",
    tags: ["Mobile App", "UX Research", "UI Design"],
    overview: "Silver Club is a social mobile app designed specifically for people aged 45 and above — a demographic that is often overlooked in digital product design. The challenge was to build something that felt modern and engaging, while remaining simple enough for users who may not interact with apps daily.",
    challenge: "How do you design a social app that feels sophisticated and trustworthy, without overwhelming users who are less comfortable with technology? Every tap, every label, every screen had to be self-explanatory.",
    process: [
      { icon: Target, title: "Discovery", desc: "User research focused on the 45+ demographic — understanding their goals, frustrations, and comfort levels with mobile apps" },
      { icon: Lightbulb, title: "Strategy", desc: "Defined accessibility-first design principles: large tap targets, clear labels, no hidden gestures, and a warm visual tone" },
      { icon: Palette, title: "Design", desc: "Built a high-fidelity Figma prototype with a warm colour system, generous spacing, and simplified navigation patterns" },
      { icon: Code, title: "Prototype", desc: "Delivered an interactive Figma prototype tested with real target users — iterated based on direct feedback" },
      { icon: Rocket, title: "Handoff", desc: "Prepared a complete design system and developer handoff documentation for pixel-perfect implementation" },
    ],
    results: [
      { value: 85, suffix: "%", label: "Task Completion Rate" },
      { value: 40, suffix: "%", label: "Engagement Increase" },
      { value: 4, suffix: ".8", label: "App Store Rating" },
      { value: 3, suffix: "x", label: "Session Duration vs Benchmark" },
    ],
  },
  "asset-management-app": {
    title: "Asset Management App",
    subtitle: "UI/UX design for a fintech portfolio dashboard",
    tags: ["Fintech", "Dashboard", "UI Design"],
    overview: "A comprehensive UI/UX redesign for a fintech asset management platform. The existing product had significant usability issues — users struggled to understand their portfolio performance and frequently contacted support for basic information. The goal was to redesign the dashboard to be clear, trustworthy, and actionable.",
    challenge: "Financial data is dense by nature. The challenge was to present complex portfolio information in a way that gave users immediate clarity — without dumbing it down for professional investors who need the detail.",
    process: [
      { icon: Target, title: "Audit", desc: "Heuristic evaluation of the existing product — identifying the 12 highest-impact usability issues causing user confusion" },
      { icon: Lightbulb, title: "Architecture", desc: "Redesigned the information architecture to surface the most critical data first, with progressive disclosure for deeper detail" },
      { icon: Palette, title: "Design", desc: "High-fidelity Figma designs with a professional, trust-building visual system — clean data visualisation and clear hierarchy" },
      { icon: Code, title: "Prototype", desc: "Interactive prototype for stakeholder review and user testing before development handoff" },
      { icon: Rocket, title: "Delivery", desc: "Complete design system and annotated developer specs for accurate front-end implementation" },
    ],
    results: [
      { value: 60, suffix: "%", label: "Reduction in Support Tickets" },
      { value: 92, suffix: "%", label: "User Satisfaction Score" },
      { value: 3, suffix: "x", label: "Faster Task Completion" },
      { value: 45, suffix: "%", label: "Increase in Daily Active Users" },
    ],
  },
};

const defaultProject = {
  title: "Case Study",
  subtitle: "A design project by ArunArudra",
  tags: ["Design", "Strategy"],
  overview: "This is a UI/UX design and front-end development project by Arun Arudra — solving a specific business problem through research-driven design, pixel-perfect Figma prototypes, and clean front-end implementation.",
  challenge: "Every product has a unique challenge — whether it's an unprofessional first impression, confusing user flows, or a gap between what the product does and what users actually need. The goal is always the same: close that gap through design.",
  process: [
    { icon: Target, title: "Discovery", desc: "Understanding the business, the users, and the problem — before touching a wireframe" },
    { icon: Lightbulb, title: "Strategy", desc: "Defining what success looks like and how the design will get there" },
    { icon: Palette, title: "Design", desc: "High-fidelity Figma prototypes — every screen intentional, every interaction purposeful" },
    { icon: Code, title: "Development", desc: "Pixel-perfect front-end build in React, Next.js, or WordPress — exactly as designed" },
    { icon: Rocket, title: "Optimise", desc: "Post-launch tracking, user feedback loops, and iterative improvements" },
  ],
  results: [
    { value: 95, suffix: "%", label: "Client Satisfaction" },
    { value: 40, suffix: "%", label: "Faster Task Completion" },
    { value: 3, suffix: "x", label: "Engagement Uplift" },
    { value: 7, suffix: "+", label: "Years of Experience Behind It" },
  ],
};

const projectOrder = ["silver-club", "asset-management-app", "darecat", "fe-casters", "krinserv", "passive-social", "soccer-bolt", "silver-club-case-study", "krinserv-branding"];

export default function ProjectDetail() {
  const { slug } = useParams();
  const { items: cmsItems } = useContentful("project", slug);
  const cms = cmsItems[0];

  const fallback = projectsData[slug || ""] || {
    ...defaultProject,
    title: slug?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Case Study",
  };

  // Allow Contentful to override process steps and results.
  // In Contentful, add JSON fields `process` (array of {title, desc}) and
  // `results` (array of {value, suffix, label}). Boolean fields
  // `hideChallenge`, `hideProcess`, `hideResults` hide those sections.
  const cmsProcess: any[] | undefined = Array.isArray((cms as any)?.process)
    ? (cms as any).process
    : undefined;
  const cmsResults: any[] | undefined = Array.isArray((cms as any)?.results)
    ? (cms as any).results
    : undefined;
  const processIcons = [Target, Lightbulb, Palette, Code, Rocket];

  const project = cms ? {
    title: cms.title || fallback.title,
    subtitle: (cms as any).subtitle || cms.excerpt || fallback.subtitle,
    tags: Array.isArray(cms.tags) ? cms.tags : fallback.tags,
    overview: cms.overview,
    overviewText: fallback.overview,
    challenge: typeof cms.challenge === "string" ? cms.challenge : fallback.challenge,
    process: cmsProcess
      ? cmsProcess.map((p: any, i: number) => ({
          icon: processIcons[i % processIcons.length],
          title: p.title || `Step ${i + 1}`,
          desc: p.desc || p.description || "",
        }))
      : fallback.process,
    results: cmsResults
      ? cmsResults.map((r: any) => ({
          value: Number(r.value) || 0,
          suffix: r.suffix || "",
          label: r.label || "",
        }))
      : fallback.results,
    heroImage: getImageUrl(cms.image),
    hideChallenge: !!(cms as any).hideChallenge,
    hideProcess: !!(cms as any).hideProcess,
    hideResults: !!(cms as any).hideResults,
  } : { ...fallback, overview: null, overviewText: fallback.overview, heroImage: "/placeholder.svg", hideChallenge: false, hideProcess: false, hideResults: false };

  const currentIdx = projectOrder.indexOf(slug || "");
  const prevSlug = currentIdx > 0 ? projectOrder[currentIdx - 1] : projectOrder[projectOrder.length - 1];
  const nextSlug = currentIdx >= 0 && currentIdx < projectOrder.length - 1 ? projectOrder[currentIdx + 1] : projectOrder[0];
  const prevLabel = prevSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const nextLabel = nextSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[80vh] flex items-end overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 bg-muted">
          <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-6 relative z-10 pb-16">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Projects
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            {project.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-primary font-medium font-mono">{tag}</span>
                {i < project.tags.length - 1 && <span className="w-1 h-1 rounded-full bg-primary" />}
              </span>
            ))}
          </div>
          <SplitTextReveal as="h1" className="font-display text-4xl md:text-6xl lg:text-7xl font-bold">
            {project.title}
          </SplitTextReveal>
          <AnimatedSection delay={0.5}>
            <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-2xl">{project.subtitle}</p>
          </AnimatedSection>
        </motion.div>
      </section>

      {/* If Contentful provides custom sections/blocks, render those. Otherwise the legacy layout. */}
      {Array.isArray((cms as any)?.sections) && (cms as any).sections.length > 0 ? (
        <ProjectBlocks blocks={(cms as any).sections} />
      ) : (
        <>
          {/* Overview */}
          <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <AnimatedSection direction="left">
                  <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">About the Project</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">Overview</h2>
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  {project.overview ? (
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-strong:text-foreground prose-a:text-primary">
                      {documentToReactComponents(project.overview)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-lg leading-relaxed">{project.overviewText}</p>
                  )}
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* Challenge */}
          {!project.hideChallenge && (
            <section className="py-24 md:py-32 bg-surface">
              <div className="container mx-auto px-6 text-center max-w-4xl">
                <AnimatedSection direction="scale">
                  <p className="text-primary font-medium mb-6 tracking-wider uppercase text-sm font-mono">The Challenge</p>
                  <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                    "{project.challenge}"
                  </blockquote>
                </AnimatedSection>
              </div>
            </section>
          )}

          {/* Process */}
          {!project.hideProcess && project.process.length > 0 && (
            <section className="py-24 md:py-32">
              <div className="container mx-auto px-6">
                <AnimatedSection>
                  <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Design Process</p>
                  <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">How We Solved It</h2>
                </AnimatedSection>
                <div className={`grid gap-4 ${project.process.length >= 5 ? "md:grid-cols-5" : `md:grid-cols-${Math.min(project.process.length, 4)}`}`}>
                  {project.process.map((step, i) => (
                    <AnimatedSection key={`${step.title}-${i}`} delay={i * 0.1} direction="up">
                      <div className="text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <step.icon className="h-7 w-7" />
                        </div>
                        <span className="text-xs text-primary font-mono mb-1 block">0{i + 1}</span>
                        <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Full-width image */}
          <section className="px-6">
            <AnimatedSection direction="scale">
              <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-muted max-w-7xl mx-auto">
                <img src="/placeholder.svg" alt="Project showcase" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </section>

          {/* Results */}
          {!project.hideResults && project.results.length > 0 && (
            <section className="py-24 md:py-32">
              <div className="container mx-auto px-6">
                <AnimatedSection>
                  <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono text-center">Impact</p>
                  <h2 className="font-display text-3xl md:text-5xl font-bold mb-16 text-center">The Results</h2>
                </AnimatedSection>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {project.results.map((stat, i) => (
                    <AnimatedSection key={`${stat.label}-${i}`} delay={i * 0.1} direction="up">
                      <div className="text-center p-6 rounded-2xl border border-border/50 bg-card">
                        <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                          <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        </div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Marquee */}
      <div className="py-8 border-y border-border/20 overflow-hidden">
        <MarqueeText
          text="Design that converts · Development that ships · 7 years of craft"
          className="font-display text-5xl md:text-7xl font-bold text-foreground/5"
          speed={25}
        />
      </div>

      {/* Prev / Next nav */}
      <section className="border-t border-border">
        <div className="grid md:grid-cols-2">
          <Link to={`/projects/${prevSlug}`} className="group p-8 md:p-12 border-b md:border-b-0 md:border-r border-border hover:bg-surface transition-colors flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:-translate-x-2 group-hover:text-primary transition-all" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Previous</p>
              <p className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">{prevLabel}</p>
            </div>
          </Link>
          <Link to={`/projects/${nextSlug}`} className="group p-8 md:p-12 hover:bg-surface transition-colors flex items-center justify-end gap-4 text-right">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Next</p>
              <p className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">{nextLabel}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-2 group-hover:text-primary transition-all" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Have a Product That Needs This?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Whether you're building from scratch or your current product looks unprofessional — let's talk about what the right design can do for your business.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base h-14" asChild>
                <Link to="/contact">Book a Call <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
