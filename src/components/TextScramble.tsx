import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const chars = "!<>-_\\/[]{}—=+*^?#________";

interface TextScrambleProps {
  children: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TextScramble({ children, className = "", delay = 0, speed = 30 }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    const timer = setTimeout(() => {
      setStarted(true);
      const target = children;
      let frame = 0;
      const totalFrames = target.length + 15;

      const interval = setInterval(() => {
        let output = "";
        for (let i = 0; i < target.length; i++) {
          if (i < frame - 10) {
            output += target[i];
          } else if (i < frame) {
            output += chars[Math.floor(Math.random() * chars.length)];
          } else {
            output += " ";
          }
        }
        setDisplay(output);
        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          setDisplay(target);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, children, delay, speed, started]);

  return (
    <span ref={ref} className={className}>
      {started ? display : "\u00A0".repeat(children.length)}
    </span>
  );
}
