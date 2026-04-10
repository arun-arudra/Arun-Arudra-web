import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

const tools = [
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "After Effects",
  "Sketch", "InVision", "Principle", "Framer", "Webflow",
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
              <AnimatedSection>
                <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">About Me</p>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">I'm Arun, a Designer Who Cares About Impact</h1>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <p className="text-muted-foreground text-lg mb-6">
                  With over 7 years of experience in UI/UX and product design, I've helped startups and established brands create digital products that users love and businesses rely on.
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  I believe great design is invisible — it solves problems so elegantly that users never have to think about it. My approach combines deep user research, strategic thinking, and meticulous visual execution.
                </p>
                <p className="text-muted-foreground text-lg">
                  Through ArunArudra, I work closely with founders, product managers, and engineering teams to create design solutions that are not just beautiful, but measurably effective.
                </p>
              </AnimatedSection>
            </div>
            <AnimatedSection delay={0.2}>
              <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden">
                <img src="/placeholder.svg" alt="Arun — UI/UX Designer and founder of ArunArudra" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Design Philosophy</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "User First", desc: "Every decision starts with understanding the user. Research, empathy, and testing drive every design choice." },
              { title: "Simplicity Wins", desc: "Complex problems deserve simple solutions. I strip away the unnecessary to reveal what truly matters." },
              { title: "Measure Impact", desc: "Design isn't just art — it's strategy. I track results and iterate based on real data and user feedback." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-border bg-card">
                  <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
              <AnimatedSection key={exp.year} delay={i * 0.1}>
                <div className="border-l-2 border-primary/30 pl-6">
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
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Tools I Use</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span key={tool} className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/30 transition-colors">{tool}</span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">I'm always open to new opportunities and collaborations.</p>
            <Button size="lg" className="rounded-full px-10 text-base" asChild>
              <Link to="/contact">Get in Touch <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
