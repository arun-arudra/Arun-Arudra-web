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
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";

const pillars = [
  {
    icon: Compass,
    number: "01",
    title: "Strategy",
    tagline: "Research-backed decisions that save you from expensive redesigns down the road.",
    thumb: "/images/projects/nova-finance.jpg",
    items: [
      { name: "Market Research", detail: "Deep dive into your competitors, target users, and market gaps — so your product enters the market with a clear advantage." },
      { name: "Brand Positioning", detail: "Defining exactly what makes you different and why your ideal customers should choose you over every other option." },
      { name: "Product Strategy", detail: "Feature prioritization, MVP scoping, and roadmap planning that keeps your team focused on what actually drives growth." },
      { name: "UX Audits", detail: "Systematic review of your existing product to find exactly what is confusing users and costing you conversions — with a prioritized fix list." },
    ],
  },
  {
    icon: Palette,
    number: "02",
    title: "Design",
    tagline: "Beautiful interfaces your users understand on first glance and come back to willingly.",
    thumb: "/images/projects/silver-club.jpg",
    items: [
      { name: "UX/UI Design", detail: "From rough wireframes to pixel-perfect Figma prototypes — every screen is designed around how real users actually think and behave." },
      { name: "Design Systems", detail: "Scalable component libraries and design tokens that keep your product visually consistent as it grows — reducing design debt from day one." },
      { name: "Mobile App Design", detail: "iOS and Android interfaces designed for real thumbs, real users, and real-world conditions — across every screen size." },
      { name: "Dashboard & Web App Design", detail: "SaaS dashboards and complex web apps designed for clarity — turning data-heavy screens into interfaces users actually enjoy working in." },
    ],
  },
  {
    icon: Code,
    number: "03",
    title: "Development",
    tagline: "Your Figma designs built precisely in React, Next.js, and WordPress — no handoff gap, no interpretation errors.",
    thumb: "/images/projects/healthtrack.jpg",
    items: [
      { name: "React / Next.js Development", detail: "Fast, scalable, and SEO-friendly front-end builds in React and Next.js — matching your Figma designs exactly, responsive on every device." },
      { name: "WordPress Development", detail: "Custom WordPress themes and CMS setups for marketing websites, blogs, and business sites — designed to be easy for your team to manage." },
      { name: "HTML / CSS / Tailwind", detail: "Clean, semantic, and accessible code with Tailwind CSS — fast to load, easy to maintain, and built to web standards." },
      { name: "Figma to Code", detail: "Your design brought to life exactly as intended — no gaps between what was designed and what gets shipped. Cross-browser tested before launch." },
    ],
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimization",
    tagline: "Post-launch improvements driven by real user behaviour — so your product keeps getting better after release.",
    thumb: "/images/projects/ecomart.jpg",
    items: [
      { name: "Performance Optimization", detail: "Speed audits, Core Web Vitals improvements, and load-time reduction that helps both your users and your Google rankings." },
      { name: "Conversion Rate Optimization", detail: "Identifying where users drop off and fixing it — through better UX, clearer CTAs, and friction removal that turns visitors into customers." },
      { name: "A/B Testing", detail: "Structured design experiments that validate what actually works with your real users — before committing to a direction." },
      { name: "Analytics Setup", detail: "GA4 event tracking, conversion funnel dashboards, and KPI monitoring — so you always know what is working and what needs attention." },
    ],
  },
];

const solutions = [
  { icon: Globe, title: "Websites", desc: "Conversion-focused websites that rank on Google, tell your brand story clearly, and turn visitors into leads — designed and built to perform from day one.", tags: ["Corporate", "Landing Pages", "Marketing Sites", "Portfolios"] },
  { icon: Smartphone, title: "Apps", desc: "Mobile and web apps with UX that onboards users in seconds and keeps them coming back. Designed for real user behaviour, built for performance.", tags: ["iOS & Android", "Progressive Web Apps", "SaaS Platforms", "Dashboards"] },
  { icon: Layers, title: "Products", desc: "Full-product work from idea to launch — strategy, UX research, UI design, and front-end development handled by one person who understands the entire picture.", tags: ["MVP Design", "Product Redesign", "Feature Expansion", "Design Systems"] },
];

function ServiceAccordion({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <AnimatedSection delay={index * 0.1} direction="up">
      <div
        className="border-b border-border/30 relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMove}
      >
        {/* Floating thumbnail preview */}
        <AnimatePresence>
          {hovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-110%",
              }}
              className="hidden md:block absolute top-0 left-0 pointer-events-none z-30 w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border"
            >
              <img src={pillar.thumb} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-mono uppercase tracking-widest text-foreground">{pillar.title}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-8 md:py-10 flex items-center justify-between gap-4 group text-left relative z-10"
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
              Strategy, design, and front-end development — all from one person who has spent 7 years obsessing over what makes digital products work, convert, and keep users coming back.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 15, suffix: "+", label: "Projects" },
              { value: 7, suffix: "+", label: "Years Experience" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 6, suffix: "+", label: "Industries Served" },
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
            <p className="text-muted-foreground max-w-xl mx-auto mb-16 text-center">A clear, repeatable process built from 7 years of project work — so you always know what happens next and why.</p>
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
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how our design and development services can accelerate your growth.</p>
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
