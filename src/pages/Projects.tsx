import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Mobile App", "Web Platform", "E-commerce", "Branding"];

const projects = [
  { title: "Silver Club", category: "Mobile App", summary: "Designing a social space for people aged 45+. A community-driven mobile application focused on meaningful connections.", slug: "silver-club", image: "/placeholder.svg" },
  { title: "HealthTrack", category: "Web Platform", summary: "Reimagining healthcare management for patients and providers with an intuitive dashboard.", slug: "healthtrack", image: "/placeholder.svg" },
  { title: "EcoMart", category: "E-commerce", summary: "Sustainable shopping experience with zero-waste focus and carbon footprint tracking.", slug: "ecomart", image: "/placeholder.svg" },
  { title: "Nova Finance", category: "Web Platform", summary: "Next-generation fintech platform for personal wealth management and investment tracking.", slug: "nova-finance", image: "/placeholder.svg" },
  { title: "Artisan Brew", category: "Branding", summary: "Complete brand identity for a craft brewery including packaging, web presence, and merchandise.", slug: "artisan-brew", image: "/placeholder.svg" },
  { title: "MindSpace", category: "Mobile App", summary: "Mental wellness app with guided meditation, journaling, and progress tracking features.", slug: "mindspace", image: "/placeholder.svg" },
];

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Projects</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl">Selected Work & Case Studies</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">A collection of projects that showcase my approach to solving design challenges for startups and established brands.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    active === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.08}>
                <Link to={`/projects/${p.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="text-muted-foreground text-sm">{p.summary}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Want to Be the Next Success Story?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Let's discuss how design can elevate your brand and product.</p>
            <Button size="lg" className="rounded-full px-10 text-base" asChild>
              <Link to="/contact">Start a Project <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
