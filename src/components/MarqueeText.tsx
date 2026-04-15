import { motion } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
  separator?: string;
}

export function MarqueeText({ text, className = "", speed = 20, separator = "✦" }: MarqueeTextProps) {
  const items = Array(6).fill(`${text} ${separator} `).join("");

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className={`inline-block ${className}`}
      >
        <span>{items}</span>
        <span>{items}</span>
      </motion.div>
    </div>
  );
}
