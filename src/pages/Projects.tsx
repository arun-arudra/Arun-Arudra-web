import { useMemo, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { ProjectListItem } from "../components/ProjectListItem";
import { MagneticButton } from "../components/MagneticButton";
import { MarqueeText } from "../components/MarqueeText";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useContentful, getImageUrl } from "@/hooks/useContentful";
import { motion } from "framer-motion";

// Fallback projects shown ONLY if Contentful returns zero items
const fallbackProjects = [
  { title: "Silver Club", slug: "silver-club", tags: ["Mobile App", "UX Research", "UI Design"], image: "/images/projects/silver-club.jpg" },
  { title: "HealthTrack", slug: "healthtrack", tags: ["Web Platform", "Dashboard", "Data Visualization"], image: "/images/projects/healthtrack.jpg" },
  { title: "EcoMart", slug: "ecomart", tags: ["E-commerce", "Branding", "Product Design"], image: "/images/projects/ecomart.jpg" },
  { title: "Nova Finance", slug: "nova-finance", tags: ["Fintech", "Web Platform", "UX Strategy"], image: "/images/projects/nova-finance.jpg" },
  { title: "Artisan Brew", slug: "artisan-brew", tags: ["Branding", "Packaging", "Web Design"], image: "/images/projects/artisan-brew.jpg" },
  { title: "MindSpace", slug: "mindspace", tags: ["Mobile App", "Wellness", "Motion Design"], image: "/images/projects/mindspace.jpg" },
];

function SkeletonRow({ i }: { i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      className="border-b border-border/30 py-8 md:py-12 flex items-center gap-6 md:gap-10"
    >
      <div className="h-6 w-10 rounded bg-muted animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-8 md:h-10 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-3 w-40 rounded bg-muted/60 animate-pulse" />
      </div>
      <div className="h-12 w-12 rounded-full border border-border/50" />
    </motion.div>
  );
}

export default function Projects() {
  const { items, loading } = useContentful("project");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Source of truth: CMS items if present, otherwise fallback
  const baseList = useMemo(() => {
    if (items.length > 0) {
      return items.map((item) => ({
        title: item.title || "Untitled",
        slug: item.slug || item.id,
        tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : ["Case Study"]),
        image: getImageUrl(item.image),
      }));
    }
    return fallbackProjects;
  }, [items]);

  // Build category list from primary tag of each project
  const categories = useMemo(() => {
    const set = new Set<string>();
    baseList.forEach((p) => p.tags[0] && set.add(p.tags[0]));
    return ["All", ...Array.from(set)];
  }, [baseList]);

  const filtered = activeFilter === "All"
    ? baseList
    : baseList.filter((p) => p.tags.includes(activeFilter));

  const projects = filtered.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));

  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">Our Work</p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl">Selected Case Studies</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A collection of projects that showcase our approach to solving design challenges for startups and established brands.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          {/* Filter chips */}
          {!loading && categories.length > 1 && (
            <AnimatedSection direction="up" className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all border ${
                      activeFilter === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          )}

          {loading ? (
            <div className="border-t border-border/30">
              {[0, 1, 2, 3].map((i) => <SkeletonRow key={i} i={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No projects in this category yet.
            </div>
          ) : (
            <div className="border-t border-border/30">
              {projects.map((p) => (
                <ProjectListItem key={p.slug} {...p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="py-8 border-y border-border/20 overflow-hidden">
        <MarqueeText
          text="Let's Create Together"
          className="font-display text-5xl md:text-7xl font-bold text-foreground/5"
          speed={25}
        />
      </div>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Want to Be the Next Success Story?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how design can elevate your brand and product.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base h-14" asChild>
                <Link to="/contact">Start a Project <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
