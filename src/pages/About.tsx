import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { StaggerContainer, StaggerItem } from "../components/StaggerContainer";
import { MagneticButton } from "../components/MagneticButton";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

const tools = [
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "After Effects",
  "Sketch", "Framer", "Webflow", "React", "Next.js",
];

const experience = [
  { year: "2022 – Present", role: "Founder & Lead Designer", company: "ArunArudra", desc: "Leading design strategy for startups and brands across web, mobile, and branding projects." },
  { year: "2019 – 2022", role: "Senior UI/UX Designer", company: "Design Studio", desc: "Led product design for SaaS platforms and e-commerce brands, managing a team of 4 designers." },
  { year: "2017 – 2019", role: "UI Designer", company: "Creative Agency", desc: "Designed responsive websites and mobile applications for clients across industries." },
];

export default function About() {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection direction="left">
                <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">About Us</p>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">We're a Design Team That Cares About Impact</h1>
              </AnimatedSection>
              <AnimatedSection delay={0.15} direction="left">
                <p className="text-muted-foreground text-lg mb-6">
                  With over 7 years of experience in UI/UX and product design, we've helped startups and established brands create digital products that users love and businesses rely on.
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  We believe great design is invisible — it solves problems so elegantly that users never have to think about it. Our approach combines deep user research, strategic thinking, and meticulous visual execution.
                </p>
                <p className="text-muted-foreground text-lg">
                  At ArunArudra, we work closely with founders, product managers, and engineering teams to create design solutions that are not just beautiful, but measurably effective.
                </p>
              </AnimatedSection>
            </div>
            <AnimatedSection delay={0.2} direction="right">
              <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden">
                <img src="/placeholder.svg" alt="ArunArudra design team" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Our Design Philosophy</h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { title: "User First", desc: "Every decision starts with understanding the user. Research, empathy, and testing drive every design choice." },
              { title: "Simplicity Wins", desc: "Complex problems deserve simple solutions. We strip away the unnecessary to reveal what truly matters." },
              { title: "Measure Impact", desc: "Design isn't just art — it's strategy. We track results and iterate based on real data and user feedback." },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="p-8 rounded-2xl border border-border bg-card hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Experience</h2>
          </AnimatedSection>
          <div className="space-y-8 max-w-2xl">
            {experience.map((exp, i) => (
              <AnimatedSection key={exp.year} delay={i * 0.12} direction="left">
                <div className="border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors duration-300">
                  <span className="text-sm text-primary font-medium">{exp.year}</span>
                  <h3 className="font-display text-lg font-semibold mt-1">{exp.role}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{exp.company}</p>
                  <p className="text-muted-foreground text-sm mt-2">{exp.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Tools We Use</h2>
          </AnimatedSection>
          <StaggerContainer className="flex flex-wrap gap-3">
            {tools.map((tool) => (
              <StaggerItem key={tool}>
                <span className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 inline-block">{tool}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">We're always open to new opportunities and collaborations.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base" asChild>
                <Link to="/contact">Get in Touch <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
