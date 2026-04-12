import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { MagneticButton } from "../components/MagneticButton";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowLeft, Target, Lightbulb, Palette, Code, TrendingUp } from "lucide-react";

const projectsData: Record<string, {
  title: string;
  category: string;
  tags: string[];
  heroImage: string;
  about: string;
  challenge: string;
  process: { icon: any; label: string }[];
  strategy: string;
  results: { stat: string; label: string }[];
}> = {
  "silver-club": {
    title: "Silver Club",
    category: "Mobile App",
    tags: ["UX Research", "UI Design", "Prototyping"],
    heroImage: "/placeholder.svg",
    about: "Silver Club is a social platform designed for people aged 45+, creating a digital space where meaningful connections flourish. The app needed to be intuitive, accessible, and welcoming for users who may not be digital natives.",
    challenge: "The biggest challenge was designing an interface that feels modern and engaging without overwhelming users who might be less comfortable with technology. Every interaction needed to be self-explanatory while maintaining the sophistication expected of a premium social platform.",
    process: [
      { icon: Target, label: "User Research" },
      { icon: Lightbulb, label: "Strategy" },
      { icon: Palette, label: "UI Design" },
      { icon: Code, label: "Prototyping" },
      { icon: TrendingUp, label: "Testing" },
    ],
    strategy: "We conducted extensive interviews with 50+ users in the target demographic, mapping their digital habits, frustrations, and aspirations. This research informed a design system built around large touch targets, clear typography, and a warm color palette that reduces cognitive load.",
    results: [
      { stat: "92%", label: "User satisfaction score" },
      { stat: "3.2x", label: "Daily active users growth" },
      { stat: "68%", label: "Increase in session duration" },
      { stat: "4.8★", label: "App Store rating" },
    ],
  },
  "healthtrack": {
    title: "HealthTrack",
    category: "Web Platform",
    tags: ["Product Design", "Dashboard", "Data Visualization"],
    heroImage: "/placeholder.svg",
    about: "HealthTrack is a comprehensive healthcare management platform that bridges the gap between patients and providers. The platform needed to handle complex medical data while remaining accessible to everyday users.",
    challenge: "Healthcare data is inherently complex. The challenge was creating a unified dashboard that serves both patients tracking their health metrics and providers managing patient care — without compromising on data accuracy or user experience.",
    process: [
      { icon: Target, label: "Discovery" },
      { icon: Lightbulb, label: "Architecture" },
      { icon: Palette, label: "Design System" },
      { icon: Code, label: "Development" },
      { icon: TrendingUp, label: "Optimization" },
    ],
    strategy: "We mapped the entire patient-provider journey, identifying 23 critical touchpoints where the existing system created friction. Our design system was built component-first, ensuring consistency across 40+ unique screen states while maintaining HIPAA compliance standards.",
    results: [
      { stat: "45%", label: "Reduction in patient wait times" },
      { stat: "2.8x", label: "Provider efficiency improvement" },
      { stat: "89%", label: "Task completion rate" },
      { stat: "156k", label: "Active users in first year" },
    ],
  },
};

// Fallback for unknown slugs
const defaultProject = {
  title: "Case Study",
  category: "Project",
  tags: ["Design", "Strategy"],
  heroImage: "/placeholder.svg",
  about: "A comprehensive design project that pushed boundaries and delivered measurable results for our client.",
  challenge: "Creating a solution that balances user needs with business objectives while maintaining design excellence.",
  process: [
    { icon: Target, label: "Research" },
    { icon: Lightbulb, label: "Strategy" },
    { icon: Palette, label: "Design" },
    { icon: Code, label: "Build" },
    { icon: TrendingUp, label: "Launch" },
  ],
  strategy: "Our research-driven approach ensured every design decision was backed by data and validated through user testing.",
  results: [
    { stat: "40%", label: "Conversion improvement" },
    { stat: "2x", label: "User engagement" },
    { stat: "95%", label: "Client satisfaction" },
    { stat: "4.7★", label: "User rating" },
  ],
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData[slug || ""] || defaultProject;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end">
        <div className="absolute inset-0 bg-muted">
          <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 pb-16 relative z-10">
          <AnimatedSection direction="up">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {project.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-primary font-medium">{tag}</span>
                  {i < project.tags.length - 1 && <span className="w-1 h-1 rounded-full bg-primary" />}
                </span>
              ))}
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold">{project.title}</h1>
          </AnimatedSection>
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection direction="left">
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">About the Project</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Overview</h2>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.15}>
              <p className="text-muted-foreground text-lg leading-relaxed">{project.about}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <AnimatedSection direction="up">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">The Challenge</p>
            <p className="font-display text-2xl md:text-3xl font-semibold leading-snug">{project.challenge}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm text-center">The Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-16 text-center">How We Got There</h2>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-4 md:gap-0">
            {project.process.map((step, i) => (
              <AnimatedSection key={step.label} delay={i * 0.1} direction="up">
                <div className="flex items-center gap-4 md:gap-0">
                  <div className="flex flex-col items-center px-6 md:px-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-medium text-center">{step.label}</span>
                  </div>
                  {i < project.process.length - 1 && (
                    <div className="hidden md:block w-12 h-px bg-border" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Strategy & Execution</p>
              <p className="text-muted-foreground text-lg leading-relaxed">{project.strategy}</p>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.15}>
              <div className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden">
                <img src={project.heroImage} alt="Strategy" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm text-center">Impact & Results</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-16 text-center">The Numbers Speak</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {project.results.map((r, i) => (
              <AnimatedSection key={r.label} delay={i * 0.1} direction="scale">
                <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
                  <span className="font-display text-4xl md:text-5xl font-bold text-primary">{r.stat}</span>
                  <p className="text-muted-foreground text-sm mt-2">{r.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Want Results Like This?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's talk about how we can help your business grow through strategic design.</p>
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
