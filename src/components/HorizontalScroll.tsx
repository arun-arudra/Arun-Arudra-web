import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className={`sticky top-0 h-screen flex items-center overflow-hidden ${className}`}>
        <motion.div style={{ x }} className="flex gap-8 px-6">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
