import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { ServicePillar } from "../components/ServicePillar";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { MagneticButton } from "../components/MagneticButton";
import { ArrowRight, Compass, Palette, Code, BarChart3, Globe, Smartphone, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

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

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Services</p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl">
              A Team That Brings Bold Digital Experiences to Life
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              We combine strategy, design, and technology to create products that look stunning, work flawlessly, and deliver measurable business impact.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Pillars */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Our Expertise</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">What We Bring to the Table</h2>
          </AnimatedSection>
          <div>
            {pillars.map((p, i) => (
              <ServicePillar key={p.number} {...p} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm text-center">Our Process</p>
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
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Solutions</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">The Digital Solutions We Build</h2>
          </AnimatedSection>
          <div className="space-y-6">
            {solutions.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1} direction="up">
                <div className="group p-8 md:p-12 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <s.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
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
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to Turn Ideas Into<br />High-Performing Products?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how our design services can accelerate your growth.</p>
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
