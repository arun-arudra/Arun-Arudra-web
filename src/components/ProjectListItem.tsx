import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectListItemProps {
  title: string;
  slug: string;
  tags: string[];
  image: string;
  number: string;
}

export function ProjectListItem({ title, slug, tags, image, number }: ProjectListItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const PREVIEW_W = 460;
  const PREVIEW_H = 320;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.6 });
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.85);
  const springOpacity = useSpring(opacity, { stiffness: 260, damping: 28 });
  const springScale = useSpring(scale, { stiffness: 220, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - PREVIEW_W / 2);
    mouseY.set(e.clientY - rect.top - PREVIEW_H / 2);
    opacity.set(1);
    scale.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
    scale.set(0.85);
  };

  return (
    <Link
      ref={ref}
      to={`/projects/${slug}`}
      className="group relative block border-b border-border/30 py-8 md:py-12 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Large floating preview that follows the cursor (desktop only) */}
      <motion.div
        ref={imgRef}
        style={{ x: springX, y: springY, opacity: springOpacity, scale: springScale, width: PREVIEW_W, height: PREVIEW_H }}
        className="absolute rounded-2xl overflow-hidden z-10 pointer-events-none hidden md:block shadow-2xl ring-1 ring-border/30"
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>

      <div className="relative z-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 md:gap-10">
          <span className="text-muted-foreground/30 font-display text-lg md:text-2xl font-bold tabular-nums w-10">
            {number}
          </span>
          <div>
            <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              {tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{tag}</span>
                  {i < tags.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
          <ArrowUpRight className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
        </div>
      </div>

      {/* Hover background sweep */}
      <div className="absolute inset-0 bg-primary/5 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
    </Link>
  );
}
