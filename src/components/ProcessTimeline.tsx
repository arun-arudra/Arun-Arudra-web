import { AnimatedSection } from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Discovery & Definition",
    desc: "We dive deep into your business, users, and competitive landscape. Stakeholder interviews, technical scoping, and heuristic analysis shape a clear strategy and roadmap — so everyone agrees before we begin.",
  },
  {
    number: "02",
    title: "Design & Prototyping",
    desc: "From low-fidelity wireframes to high-fidelity Figma prototypes, we craft every screen and interaction with intention. Clickable prototypes let you experience and give feedback before a single line of code is written.",
  },
  {
    number: "03",
    title: "Development & Testing",
    desc: "Pixel-perfect front-end implementation with clean, scalable code. Rigorous QA testing validates that everything works flawlessly across all devices, browsers, and screen sizes before launch.",
  },
  {
    number: "04",
    title: "Refine & Optimize",
    desc: "Post-launch isn't the finish line — it's the starting line. We analyze real user data, act on feedback, and continuously improve performance to maximize your return on investment.",
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
