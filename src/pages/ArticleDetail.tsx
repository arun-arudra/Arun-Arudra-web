import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { SponsorSlot } from "../components/SponsorSlot";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useContentful, getImageUrl } from "@/hooks/useContentful";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { items, loading } = useContentful("article", slug);
  const article = items[0];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading article…
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Article not found</h1>
          <Button asChild className="rounded-full mt-4"><Link to="/news">Back to News</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to News
          </Link>
          <AnimatedSection direction="up">
            {article.category && (
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">{article.category}</p>
            )}
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">{article.title}</h1>
            <p className="text-muted-foreground text-sm mb-10">
              {new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" className="mb-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
              <img src={getImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </AnimatedSection>

          {/* Minimal in-article sponsor */}
          <AnimatedSection direction="up" className="mb-10">
            <SponsorSlot storageKey={`sponsor-article-${slug}`} />
          </AnimatedSection>

          <AnimatedSection direction="up">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary">
              {article.body && documentToReactComponents(article.body)}
              {!article.body && article.overview && documentToReactComponents(article.overview)}
              {!article.body && !article.overview && article.excerpt && <p>{article.excerpt}</p>}
            </div>
          </AnimatedSection>
        </div>
      </article>
    </Layout>
  );
}
