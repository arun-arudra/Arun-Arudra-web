import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { MorphingBlob } from "../components/MorphingBlob";
import { MarqueeText } from "../components/MarqueeText";
import { MagneticButton } from "../components/MagneticButton";
import { SplitTextReveal } from "../components/SplitTextReveal";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import studio1 from "/images/about/studio-1.jpg";
import process1 from "/images/about/process-1.jpg";
import collab1 from "/images/about/collab-1.jpg";

const stats = [
  { value: 7, suffix: "+", label: "Years in craft" },
  { value: 15, suffix: "+", label: "Projects delivered" },
  { value: 6, suffix: "+", label: "Industries served" },
];

const principles = [
  { n: "01", title: "Clarity over cleverness", desc: "A confused user is a lost user. I design for immediate understanding — clean layouts, clear hierarchy, and every element earning its place on screen." },
  { n: "02", title: "Outcomes over outputs", desc: "Screens are not the goal. A product your users love and your business grows from is. I measure my work by what changes after launch — not what I handed over." },
  { n: "03", title: "Craft in every pixel", desc: "Seven years of design has taught me that the difference between amateur and professional is always in the details — the spacing, the motion, the micro-copy that makes users feel something." },
  { n: "04", title: "Partnership over delivery", desc: "I don't disappear after the kickoff call. I stay involved, give honest pushback when needed, and treat your product decisions with the same care I'd give my own." },
];

const capabilities = [
  "UI/UX Design", "Product Strategy", "React Development", "WordPress Development",
  "Design Systems", "Figma Prototyping", "Conversion Optimization", "Motion Design",
];

const tools = ["Figma", "React", "Next.js", "WordPress", "HTML / CSS", "After Effects", "Photoshop", "Notion"];

const press = ["Behance", "Dribbble", "LinkedIn", "Upwork", "GitHub", "Figma Community"];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <MorphingBlob />
        </div>
        <div className="container relative mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">— About ArunArudra</p>
          </AnimatedSection>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                <SplitTextReveal>We design digital</SplitTextReveal>
                <br />
                <SplitTextReveal>products that move</SplitTextReveal>
                <br />
                <span className="text-primary italic font-light">markets.</span>
              </h1>
            </div>
            <AnimatedSection delay={0.4} className="lg:col-span-4">
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                ArunArudra is a design and development studio led by Arun — a product designer and front-end developer with 7+ years of experience across graphic design, UI/UX, and front-end development. We work with startups and growing businesses to ship products that earn attention, win users, and pay back.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Manifesto marquee */}
      <div className="py-6 border-y border-border bg-surface overflow-hidden">
        <MarqueeText
          text="UI/UX Design ✦ Front-End Development ✦ Strategy ✦ Figma ✦ React ✦ WordPress"
          className="font-display text-4xl md:text-6xl font-bold text-foreground/80"
          speed={30}
        />
      </div>

      {/* Who we are */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <AnimatedSection direction="left" className="lg:col-span-5">
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-4">— Who we are</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                A designer who builds.
A builder who designs.
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="lg:col-span-7 lg:pt-4">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Most designers hand off Figma files and hope for the best. Most developers receive those files and struggle with the original intent. I do both — which means what gets built is exactly what was designed, because the same person did both.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                With roots in graphic design and 4+ years of dedicated UI/UX and front-end development experience, I've shipped products across fintech, healthcare, social apps, food tech, e-commerce, and SaaS. Every project I take gets my full, senior-level attention — no outsourcing, no junior handoffs.
              </p>
            </AnimatedSection>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <AnimatedSection direction="up" className="col-span-12 md:col-span-7">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img src={studio1} alt="Arun Arudra UI UX designer studio workspace" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="up" delay={0.15} className="col-span-6 md:col-span-5">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img src={process1} alt="UI UX wireframing and design process" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="up" delay={0.3} className="col-span-6 md:col-span-5 md:col-start-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img src={collab1} alt="Product design and development collaboration" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-4">— What we stand for</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-16 max-w-3xl leading-tight">
              Four principles that shape every decision.
            </h2>
          </AnimatedSection>
          <div className="border-t border-border">
            {principles.map((p, i) => (
              <AnimatedSection key={p.n} delay={i * 0.08} direction="up">
                <motion.div
                  whileHover={{ x: 16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="group grid grid-cols-12 gap-6 items-center py-8 md:py-10 border-b border-border cursor-default"
                >
                  <span className="col-span-2 md:col-span-1 font-mono text-sm text-muted-foreground group-hover:text-primary transition-colors">{p.n}</span>
                  <h3 className="col-span-10 md:col-span-5 font-display text-2xl md:text-4xl font-bold group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="col-span-12 md:col-span-5 md:col-start-7 text-muted-foreground text-base md:text-lg leading-relaxed">
                    {p.desc}
                  </p>
                  <ArrowUpRight className="hidden md:block col-span-1 h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-4">— Capabilities</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 max-w-2xl">
              Full-stack craft, end to end.
            </h2>
          </AnimatedSection>
          <div className="flex flex-wrap gap-3 mb-16">
            {capabilities.map((c, i) => (
              <AnimatedSection key={c} delay={i * 0.04}>
                <span className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-block">
                  {c}
                </span>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Tools we ship with</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-border rounded-2xl overflow-hidden">
            {tools.map((t, i) => (
              <AnimatedSection key={t} delay={i * 0.03}>
                <div className="bg-background h-20 flex items-center justify-center text-sm font-mono text-muted-foreground hover:text-primary hover:bg-surface transition-colors">
                  {t}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 md:py-20 bg-surface border-y border-border">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">Find My Work On</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-20">
            {press.map((p, i) => (
              <AnimatedSection key={p} delay={i * 0.06}>
                <span className="font-display text-xl md:text-2xl font-bold text-muted-foreground/60 hover:text-foreground transition-colors duration-300">
                  {p}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 md:py-40 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-10">
          <MarqueeText
            text="Let's turn your idea into a product people love ✦"
            className="font-display text-7xl md:text-9xl font-bold"
            speed={40}
          />
        </div>
        <div className="container relative mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
              Ready to build something your users <span className="italic text-primary">actually love</span>?
            </h2>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/contact">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
