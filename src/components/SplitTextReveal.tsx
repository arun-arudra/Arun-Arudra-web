import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function SplitTextReveal({ children, className = "", delay = 0, as: Tag = "div" }: SplitTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const lines = children.split("\n");

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%", rotate: 3 }}
            animate={isInView ? { y: 0, rotate: 0 } : { y: "110%", rotate: 3 }}
            transition={{
              duration: 0.8,
              delay: delay + lineIdx * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
