import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { ProjectListItem } from "../components/ProjectListItem";
import { MagneticButton } from "../components/MagneticButton";
import { MarqueeText } from "../components/MarqueeText";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

// Fallback projects shown if Contentful is empty / errors out
const fallbackProjects = [
  { title: "Silver Club", slug: "silver-club", tags: ["Mobile App", "UX Research", "UI Design"], image: "/images/projects/silver-club.jpg" },
  { title: "HealthTrack", slug: "healthtrack", tags: ["Web Platform", "Dashboard", "Data Visualization"], image: "/images/projects/healthtrack.jpg" },
  { title: "EcoMart", slug: "ecomart", tags: ["E-commerce", "Branding", "Product Design"], image: "/images/projects/ecomart.jpg" },
  { title: "Nova Finance", slug: "nova-finance", tags: ["Fintech", "Web Platform", "UX Strategy"], image: "/images/projects/nova-finance.jpg" },
  { title: "Artisan Brew", slug: "artisan-brew", tags: ["Branding", "Packaging", "Web Design"], image: "/images/projects/artisan-brew.jpg" },
  { title: "MindSpace", slug: "mindspace", tags: ["Mobile App", "Wellness", "Motion Design"], image: "/images/projects/mindspace.jpg" },
];

export default function Projects() {
  const { items, loading } = useContentful("project");

  const cmsProjects = items.map((item) => ({
    title: item.title || "Untitled",
    slug: item.slug || item.id,
    tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : ["Case Study"]),
    image: getImageUrl(item.image),
  }));

  // CMS projects first, then fallback projects (deduped by slug)
  const slugs = new Set(cmsProjects.map((p) => p.slug));
  const merged = [
    ...cmsProjects,
    ...fallbackProjects.filter((p) => !slugs.has(p.slug)),
  ];

  const projects = merged.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));

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
          {loading && projects.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading projects…
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
