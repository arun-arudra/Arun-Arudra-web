import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { ProjectCard } from "../components/ProjectCard";
import { MagneticButton } from "../components/MagneticButton";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

const projects = [
  { title: "Silver Club", slug: "silver-club", tags: ["Mobile App", "UX Research", "UI Design"], image: "/placeholder.svg" },
  { title: "HealthTrack", slug: "healthtrack", tags: ["Web Platform", "Dashboard", "Data Visualization"], image: "/placeholder.svg" },
  { title: "EcoMart", slug: "ecomart", tags: ["E-commerce", "Branding", "Product Design"], image: "/placeholder.svg" },
  { title: "Nova Finance", slug: "nova-finance", tags: ["Fintech", "Web Platform", "UX Strategy"], image: "/placeholder.svg" },
  { title: "Artisan Brew", slug: "artisan-brew", tags: ["Branding", "Packaging", "Web Design"], image: "/placeholder.svg" },
  { title: "MindSpace", slug: "mindspace", tags: ["Mobile App", "Wellness", "Motion Design"], image: "/placeholder.svg" },
];

export default function Projects() {
  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection direction="left">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Our Work</p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl">Selected Case Studies</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A collection of projects that showcase our approach to solving design challenges for startups and established brands.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection direction="scale">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Want to Be the Next Success Story?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how design can elevate your brand and product.</p>
            <MagneticButton>
              <Button size="lg" className="rounded-full px-10 text-base" asChild>
                <Link to="/contact">Start a Project <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
