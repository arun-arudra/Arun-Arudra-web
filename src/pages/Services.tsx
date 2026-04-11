import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { StaggerContainer, StaggerItem } from "../components/StaggerContainer";
import { MagneticButton } from "../components/MagneticButton";
import { Palette, Monitor, Smartphone, PenTool, Code, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    desc: "Research-driven, user-centered interface design that balances aesthetics with functionality. From wireframes to high-fidelity prototypes, I create experiences users love.",
    process: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems"],
  },
  {
    icon: Smartphone,
    title: "Product Design",
    desc: "End-to-end product design covering strategy, interaction design, and visual execution. I help transform ideas into scalable digital products.",
    process: ["Product Strategy", "User Flows", "Interaction Design", "Visual Design", "Launch Support"],
  },
  {
    icon: Monitor,
    title: "Website Design",
    desc: "High-performance, responsive websites designed for conversion and SEO. Clean code, fast loading, and pixel-perfect execution.",
    process: ["Information Architecture", "Responsive Design", "SEO Optimization", "Performance Tuning", "Analytics Setup"],
  },
  {
    icon: PenTool,
    title: "Branding & Identity",
    desc: "Comprehensive visual identity systems including logo design, color palettes, typography, and brand guidelines that make lasting impressions.",
    process: ["Brand Strategy", "Logo Design", "Color & Typography", "Brand Guidelines", "Asset Creation"],
  },
  {
    icon: Code,
    title: "Development Support",
    desc: "Design-to-development handoff with detailed specifications, component libraries, and developer-friendly documentation.",
    process: ["Design Specs", "Component Libraries", "Developer Handoff", "QA Support", "Design Tokens"],
  },
  {
    icon: Lightbulb,
    title: "Design Consulting",
    desc: "Strategic design advice for teams and organizations. UX audits, design system reviews, and process optimization.",
    process: ["UX Audits", "Design Reviews", "Process Optimization", "Team Training", "Strategy Sessions"],
  },
];

export default function Services() {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Services</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl">Design Services That Drive Results</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">I offer strategic design services tailored to startups and brands that want to build exceptional digital experiences.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.process.map((step) => (
                      <span key={step} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{step}</span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Have a Project in Mind?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how my design services can help you achieve your goals.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base" asChild>
                <Link to="/contact">Start a Project <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
