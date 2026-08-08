import { motion } from "framer-motion";

const clients = [
  "PulseAI", "GroundBlimp", "Syncope", "BrightEdge", "Novoro",
  "Finema", "Animoxy", "Luminex", "TechSurf", "MandorenLabs",
];

export function LogoMarquee() {
  return (
    <div className="overflow-hidden py-12 border-y border-border/50">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...clients, ...clients].map((name, i) => (
          <span
            key={i}
            className="text-muted-foreground/40 font-display text-xl md:text-2xl font-semibold tracking-wide select-none"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
