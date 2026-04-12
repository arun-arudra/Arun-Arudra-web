import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServicePillarProps {
  icon: LucideIcon;
  number: string;
  title: string;
  tagline: string;
  items: { name: string; detail: string }[];
  defaultOpen?: boolean;
}

export function ServicePillar({ icon: Icon, number, title, tagline, items, defaultOpen = false }: ServicePillarProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-8 md:py-10 flex items-center gap-6 md:gap-10 text-left group"
      >
        <span className="text-primary/30 font-display text-4xl md:text-6xl font-bold leading-none">
          {number}
        </span>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 hidden md:block">{tagline}</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-10 pl-0 md:pl-[8.5rem] grid sm:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <div
                  key={item.name}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-primary/40 font-display text-sm font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-display font-semibold text-base">{item.name}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm pl-8">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
