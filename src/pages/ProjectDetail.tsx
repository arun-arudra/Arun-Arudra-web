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
    subtitle: "A social platform designed for meaningful connections",
    tags: ["Mobile App", "UX Research", "UI Design"],
    overview: "Silver Club is a social platform designed for people aged 45+, creating a digital space where meaningful connections flourish. The app needed to be intuitive, accessible, and welcoming for users who may not be digital natives.",
    challenge: "The biggest challenge was designing an interface that feels modern and engaging without overwhelming users who might be less comfortable with technology. Every interaction needed to be self-explanatory while maintaining visual sophistication.",
    process: [
      { icon: Target, title: "Research", desc: "50+ user interviews with the target demographic to understand pain points" },
      { icon: Lightbulb, title: "Strategy", desc: "Defined accessibility-first design principles and interaction patterns" },
      { icon: Palette, title: "Design", desc: "Created a warm, inviting visual system with large touch targets" },
      { icon: Code, title: "Prototype", desc: "Built interactive prototypes tested with real users across 3 rounds" },
      { icon: Rocket, title: "Launch", desc: "Guided development handoff and post-launch optimization" },
    ],
    results: [
      { value: 85, suffix: "%", label: "Task Completion Rate" },
      { value: 40, suffix: "%", label: "Engagement Increase" },
      { value: 4, suffix: ".8", label: "App Store Rating" },
      { value: 60, suffix: "K", label: "Downloads in 3 Months" },
    ],
  },
  "healthtrack": {
    title: "HealthTrack",
    subtitle: "Reimagining health data visualization",
    tags: ["Web Platform", "Dashboard", "Data Visualization"],
    overview: "HealthTrack is a comprehensive health monitoring platform that transforms complex medical data into intuitive, actionable insights for both patients and healthcare providers.",
    challenge: "Making dense medical data understandable without oversimplifying it. The platform needed to serve both medical professionals who need detailed analytics and patients who want a clear picture of their health.",
    process: [
      { icon: Target, title: "Discovery", desc: "Stakeholder interviews with doctors, nurses, and patients" },
      { icon: Lightbulb, title: "Architecture", desc: "Designed role-based information architecture" },
      { icon: Palette, title: "Visualization", desc: "Developed a custom data visualization system" },
      { icon: Code, title: "Development", desc: "Frontend implementation with real-time data" },
      { icon: Rocket, title: "Iteration", desc: "A/B tested dashboard layouts with 200+ users" },
    ],
    results: [
      { value: 70, suffix: "%", label: "Faster Data Interpretation" },
      { value: 92, suffix: "%", label: "User Satisfaction" },
      { value: 3, suffix: "x", label: "More Daily Active Users" },
      { value: 50, suffix: "%", label: "Reduced Support Tickets" },
    ],
  },
};

const defaultProject = {
  title: "Case Study",
  subtitle: "A design project by ArunArudra",
  tags: ["Design", "Strategy"],
  overview: "This project showcases our approach to solving complex design challenges through research-driven methodology and creative excellence.",
  challenge: "The challenge was to create a product that stands out in a crowded market while maintaining usability and accessibility for all users.",
  process: [
    { icon: Target, title: "Research", desc: "Deep dive into user needs and market landscape" },
    { icon: Lightbulb, title: "Strategy", desc: "Defining the approach and design principles" },
    { icon: Palette, title: "Design", desc: "Crafting the visual identity and interaction patterns" },
    { icon: Code, title: "Build", desc: "Pixel-perfect implementation and quality assurance" },
    { icon: Rocket, title: "Launch", desc: "Deployment, monitoring, and continuous improvement" },
  ],
  results: [
    { value: 95, suffix: "%", label: "Client Satisfaction" },
    { value: 40, suffix: "%", label: "Performance Improvement" },
    { value: 3, suffix: "x", label: "Conversion Rate" },
    { value: 2, suffix: "M", label: "Users Reached" },
  ],
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projectsData[slug || ""] || {
    ...defaultProject,
    title: slug?.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Case Study",
  };

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
          <img src="/placeholder.svg" alt={project.title} className="w-full h-full object-cover" />
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

      {/* Overview */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection direction="left">
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">About the Project</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Overview</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed">{project.overview}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Challenge */}
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

      {/* Process */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Our Process</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">How We Got There</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-5 gap-4">
            {project.process.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.1} direction="up">
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

      {/* Full-width image */}
      <section className="px-6">
        <AnimatedSection direction="scale">
          <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-muted max-w-7xl mx-auto">
            <img src="/placeholder.svg" alt="Project showcase" className="w-full h-full object-cover" />
          </div>
        </AnimatedSection>
      </section>

      {/* Results */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono text-center">Impact</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16 text-center">The Results</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {project.results.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1} direction="up">
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

      {/* Marquee */}
      <div className="py-8 border-y border-border/20 overflow-hidden">
        <MarqueeText
          text="Let's Create Something Amazing"
          className="font-display text-5xl md:text-7xl font-bold text-foreground/5"
          speed={25}
        />
      </div>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Want Results Like This?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how we can transform your product through strategic design.</p>
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
