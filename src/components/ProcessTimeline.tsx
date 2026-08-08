import { AnimatedSection } from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Discovery & Definition",
    desc: "We start by understanding your problem deeply — not just the brief. What are users really struggling with? Where is the current product failing? What does success actually look like? This shapes everything that follows.",
  },
  {
    number: "02",
    title: "Design & Prototyping",
    desc: "Wireframes first. High-fidelity Figma prototypes second. Every screen is intentional. You get to click through the product and catch issues before development begins — saving weeks of back-and-forth later.",
  },
  {
    number: "03",
    title: "Development & Testing",
    desc: "Every design decision is built exactly as intended — in React, Next.js, or WordPress. We test across devices, browsers, and edge cases before anything goes live. What you approved in Figma is what you get.",
  },
  {
    number: "04",
    title: "Refine & Optimize",
    desc: "Launch is not the end — it's where the real learning starts. We track how real users behave, identify friction points, and make improvements based on data. Your product gets better every week after release.",
  },
];

export function ProcessTimeline() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden">
      {steps.map((step, i) => (
        <AnimatedSection key={step.number} delay={i * 0.1} direction="up">
          <div className="bg-card p-8 md:p-10 h-full group hover:bg-primary/5 transition-colors duration-500">
            <span className="text-primary font-display text-5xl md:text-6xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
              {step.number}
            </span>
            <h3 className="font-display text-lg font-bold mt-4 mb-3">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
