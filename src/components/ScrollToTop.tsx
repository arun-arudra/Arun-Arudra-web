import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ballRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const controls = useAnimationControls();
  const mousePos = useRef({ x: 0, y: 0 });
  const bounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);

      const footer = document.getElementById("footer");
      footerRef.current = footer;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const isInFooter = rect.top < window.innerHeight - 60;
        setInFooter(isInFooter);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile || !inFooter) return;
      const footer = footerRef.current;
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
      mousePos.current = { x: relX, y: relY };

      controls.start({
        x: relX,
        y: relY,
        transition: { type: "spring", stiffness: 150, damping: 8 },
      });

      if (bounceTimeout.current) clearTimeout(bounceTimeout.current);
      bounceTimeout.current = setTimeout(() => {
        controls.start({
          x: 0,
          y: 0,
          transition: { type: "spring", stiffness: 200, damping: 12 },
        });
      }, 200);
    },
    [inFooter, isMobile, controls]
  );

  const handleMouseLeave = useCallback(() => {
    controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    });
  }, [controls]);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer || isMobile) return;
    footer.addEventListener("mousemove", handleMouseMove);
    footer.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, isMobile]);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible || isMobile) return null;

  return (
    <motion.div
      ref={ballRef}
      animate={controls}
      onClick={scrollUp}
      className={`fixed z-50 cursor-pointer transition-all duration-500 ${
        inFooter
          ? "bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          : "bottom-8 right-8 w-12 h-12 rounded-xl bg-foreground text-background shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
      }`}
      whileHover={!inFooter ? { scale: 1.1 } : undefined}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </motion.div>
  );
}
