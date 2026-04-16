import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const [variant, setVariant] = useState<"default" | "hover" | "text" | "hidden">("default");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Hide default cursor
    document.documentElement.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='hover']");
      const textBlock = target.closest("h1, h2, h3, p, [data-cursor='text']");

      if (interactive) {
        setVariant("hover");
      } else if (textBlock) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };

    const handleMouseLeave = () => setVariant("hidden");
    const handleMouseEnter = () => setVariant("default");

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  const sizes = {
    default: 32,
    hover: 56,
    text: 6,
    hidden: 0,
  };

  const size = sizes[variant];

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: size,
            height: size,
            borderRadius: "50%",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="border-2 border-primary-foreground bg-primary-foreground/10"
          style={{
            backdropFilter: variant === "hover" ? "invert(1)" : "none",
          }}
        >
          {variant === "hover" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center justify-center w-full h-full text-[8px] uppercase tracking-widest font-bold text-primary-foreground"
            >
              View
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: variant === "hover" ? 4 : 6,
            height: variant === "hover" ? 4 : 6,
            opacity: variant === "hidden" ? 0 : 1,
          }}
          className="rounded-full bg-primary"
        />
      </motion.div>
    </>
  );
}
