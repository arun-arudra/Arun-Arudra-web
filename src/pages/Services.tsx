import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { SplitTextReveal } from "../components/SplitTextReveal";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { MarqueeText } from "../components/MarqueeText";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { MagneticButton } from "../components/MagneticButton";
import { ArrowRight, Compass, Palette, Code, BarChart3, Globe, Smartphone, Layers, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const pillars = [
  {
    icon: Compass,
    number: "01",
    title: "Strategy",
    tagline: "Research-backed insights that align user needs with business goals.",
    items: [
      { name: "Market Research", detail: "Competitive analysis, user interviews, and market opportunity mapping." },
      { name: "Brand Positioning", detail: "Defining your unique value proposition and market differentiation." },
      { name: "Product Strategy", detail: "Feature prioritization, roadmap planning, and MVP scoping." },
      { name: "UX Audits", detail: "Comprehensive evaluation of existing products with actionable recommendations." },
    ],
  },
  {
    icon: Palette,
    number: "02",
    title: "Design",
    tagline: "Crafting interfaces and identities that users remember and love.",
    items: [
      { name: "UX/UI Design", detail: "User-centered interface design from wireframes to high-fidelity prototypes." },
      { name: "Brand Identity", detail: "Logo, color systems, typography, and comprehensive brand guidelines." },
      { name: "Motion Design", detail: "Micro-interactions and animations that bring interfaces to life." },
      { name: "Design Systems", detail: "Scalable component libraries and design tokens for consistent products." },
    ],
  },
  {
    icon: Code,
    number: "03",
    title: "Development",
    tagline: "Pixel-perfect implementation with clean, scalable code.",
    items: [
      { name: "Frontend Development", detail: "React, Next.js, and modern frameworks for responsive, fast interfaces." },
      { name: "Webflow & CMS", detail: "No-code/low-code implementations for marketing sites and landing pages." },
      { name: "Dev Handoff", detail: "Detailed specs, component libraries, and developer-friendly documentation." },
      { name: "QA Support", detail: "Cross-browser testing, accessibility audits, and performance optimization." },
    ],
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimization",
    tagline: "Post-launch refinement driven by real data and user feedback.",
    items: [
      { name: "Performance Optimization", detail: "Speed audits, Core Web Vitals improvements, and caching strategies." },
      { name: "Conversion Rate Optimization", detail: "A/B testing, heatmaps, and funnel analysis to maximize conversions." },
      { name: "User Retention", detail: "Engagement analysis, onboarding flows, and feature adoption strategies." },
      { name: "Analytics Setup", detail: "Event tracking, dashboards, and KPI monitoring for data-driven decisions." },
    ],
  },
];

const solutions = [
  { icon: Globe, title: "Websites", desc: "High-performance, responsive websites designed for conversion, SEO, and brand storytelling.", tags: ["Corporate", "Landing Pages", "Marketing Sites", "Portfolios"] },
  { icon: Smartphone, title: "Apps", desc: "Native-feel mobile and web applications with intuitive UX and scalable architecture.", tags: ["iOS & Android", "Progressive Web Apps", "SaaS Platforms", "Dashboards"] },
  { icon: Layers, title: "Products", desc: "End-to-end digital product design from concept to launch — strategy, design, and post-launch support.", tags: ["MVP Design", "Product Redesign", "Feature Expansion", "Design Systems"] },
];

function ServiceAccordion({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <AnimatedSection delay={index * 0.1} direction="up">
      <div className="border-b border-border/30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-8 md:py-10 flex items-center justify-between gap-4 group text-left"
        >
          <div className="flex items-center gap-6 md:gap-10">
            <span className="text-primary/30 font-display text-3xl md:text-5xl font-bold tabular-nums">{pillar.number}</span>
            <div>
              <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold group-hover:text-primary transition-colors duration-300">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">{pillar.tagline}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center shrink-0 group-hover:border-primary group-hover:text-primary transition-colors">
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-10 pl-0 md:pl-20 grid md:grid-cols-2 gap-4">
                {pillar.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-xl bg-card border border-border/30 hover:border-primary/20 transition-colors duration-300 group/item"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-primary">0{i + 1}</span>
                      <h4 className="font-display font-semibold group-hover/item:text-primary transition-colors">{item.name}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="none">
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm font-mono">Services</p>
          </AnimatedSection>
          <SplitTextReveal
            as="h1"
            delay={0.2}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
          >
            {"A Team That Brings Bold\nDigital Experiences to Life"}
          </SplitTextReveal>
          <AnimatedSection delay={0.6}>
            <p className="text-muted-foreground text-lg max-w-2xl mt-6">
              We combine strategy, design, and technology to create products that look stunning, work flawlessly, and deliver measurable business impact.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 50, suffix: "+", label: "Projects" },
              { value: 7, suffix: "+", label: "Years Experience" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 15, suffix: "+", label: "Team Members" },
            ].map((stat, i) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pillars as Accordion */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Our Expertise</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">What We Bring to the Table</h2>
          </AnimatedSection>
          <div className="border-t border-border/30">
            {pillars.map((p, i) => (
              <ServiceAccordion key={p.number} pillar={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-y border-border/20 overflow-hidden">
        <MarqueeText
          text="Strategy · Design · Development · Optimization"
          className="font-display text-5xl md:text-7xl font-bold text-foreground/5"
          speed={25}
        />
      </div>

      {/* Process Timeline */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm text-center font-mono">Our Process</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-center">How We Bring Ideas to Life</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-16 text-center">A proven, repeatable process that balances creativity with strategic thinking.</p>
          </AnimatedSection>
          <ProcessTimeline />
        </div>
      </section>

      {/* Solutions */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Solutions</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">The Digital Solutions We Build</h2>
          </AnimatedSection>
          <div className="space-y-6">
            {solutions.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1} direction="up">
                <div className="group p-8 md:p-12 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <s.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to Turn Ideas Into<br />High-Performing Products?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how our design services can accelerate your growth.</p>
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
