import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  slug: string;
  tags: string[];
  image: string;
  index: number;
}

export function ProjectCard({ title, slug, tags, image, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/projects/${slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="aspect-[16/9] bg-muted overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          {/* Hover arrow */}
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{tag}</span>
                  {i < tags.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                  )}
                </span>
              ))}
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
