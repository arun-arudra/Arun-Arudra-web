import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionIndicatorProps {
  sections: { id: string; label: string }[];
}

export function SectionIndicator({ sections }: SectionIndicatorProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const total = String(sections.length).padStart(2, "0");
  const current = String(active + 1).padStart(2, "0");

  return (
    <div className="hidden 2xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-6 pointer-events-none mix-blend-difference text-white">
      <div className="flex items-baseline gap-1 font-mono text-xs tracking-widest">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-primary font-bold"
          >
            {current}
          </motion.span>
        </AnimatePresence>
        <span className="text-muted-foreground">/ {total}</span>
      </div>
      <div className="flex flex-col gap-2">
        {sections.map((_, i) => (
          <div key={i} className="w-px h-6 bg-border relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-primary origin-top"
              animate={{ scaleY: i <= active ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={sections[active]?.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground [writing-mode:vertical-rl] rotate-180"
        >
          {sections[active]?.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
