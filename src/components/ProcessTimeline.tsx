import { AnimatedSection } from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Discovery & Definition",
    desc: "We dive deep into your business, users, and market landscape. Research-backed insights shape a clear strategy before any pixels are drawn.",
  },
  {
    number: "02",
    title: "Design & Prototyping",
    desc: "From wireframes to high-fidelity prototypes, we craft every interaction with intention. User testing validates decisions before development begins.",
  },
  {
    number: "03",
    title: "Development & Testing",
    desc: "Pixel-perfect implementation with clean, scalable code. Rigorous QA ensures everything works flawlessly across devices and browsers.",
  },
  {
    number: "04",
    title: "Refine & Optimize",
    desc: "Post-launch isn't the end — it's the beginning. We analyze real user data, iterate on feedback, and continuously improve performance.",
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
