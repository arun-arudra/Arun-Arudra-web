import { useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Link } from "react-router-dom";

interface CaseStudy {
  title: string;
  slug: string;
  tags: string[];
  image: string;
}

interface CaseStudyCarouselProps {
  studies: CaseStudy[];
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/projects/${study.slug}`}
      className="relative flex-shrink-0 w-[340px] md:w-[420px] h-[260px] md:h-[320px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={study.image}
        alt={study.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Overlay on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent flex flex-col justify-end p-6"
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {study.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-primary-foreground/80 font-mono">{tag}</span>
              {i < study.tags.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-primary" />
              )}
            </span>
          ))}
        </div>
        <motion.h3
          initial={false}
          animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-xl md:text-2xl font-bold text-primary-foreground"
        >
          {study.title}
        </motion.h3>
      </motion.div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-primary/30 transition-all duration-500 pointer-events-none" />
    </Link>
  );
}

export function CaseStudyCarousel({ studies }: CaseStudyCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const speed = 0.5; // px per frame

  // Duplicate items for seamless loop
  const items = [...studies, ...studies];

  useAnimationFrame(() => {
    if (paused || !trackRef.current) return;
    xRef.current -= speed;
    const singleWidth = trackRef.current.scrollWidth / 2;
    if (Math.abs(xRef.current) >= singleWidth) {
      xRef.current = 0;
    }
    trackRef.current.style.transform = `translateX(${xRef.current}px)`;
  });

  return (
    <section className="py-24 md:py-32 bg-card overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Case Studies</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold">Our Recent Work</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-card to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-card to-transparent pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform"
          style={{ width: "max-content" }}
        >
          {items.map((study, i) => (
            <CaseStudyCard key={`${study.slug}-${i}`} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
