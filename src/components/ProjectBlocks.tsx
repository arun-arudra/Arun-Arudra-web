import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { AnimatedSection } from "./AnimatedSection";
import { AnimatedCounter } from "./AnimatedCounter";

interface Block {
  _id?: string;
  _type?: string;
  [key: string]: any;
}

function getUrl(img: any): string {
  if (!img) return "";
  if (Array.isArray(img)) return img[0]?.url || "";
  return img.url || "";
}

function TextBlock({ block }: { block: Block }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {(block.eyebrow || block.heading) && (
            <AnimatedSection direction="left" className="lg:col-span-4">
              {block.eyebrow && (
                <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm font-mono">{block.eyebrow}</p>
              )}
              {block.heading && (
                <h2 className="font-display text-3xl md:text-4xl font-bold">{block.heading}</h2>
              )}
            </AnimatedSection>
          )}
          <AnimatedSection delay={0.15} className={block.heading || block.eyebrow ? "lg:col-span-8" : "lg:col-span-12"}>
            {block.body && (
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-strong:text-foreground prose-a:text-primary">
                {documentToReactComponents(block.body)}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ImageBlock({ block }: { block: Block }) {
  const url = getUrl(block.image);
  const fullBleed = block.fullBleed;
  return (
    <section className={fullBleed ? "py-12" : "py-16 md:py-24 px-6"}>
      <AnimatedSection direction="scale">
        <figure className={fullBleed ? "" : "max-w-7xl mx-auto"}>
          <div className={`overflow-hidden bg-muted ${fullBleed ? "" : "rounded-2xl"}`}>
            <img src={url} alt={block.caption || ""} className="w-full h-auto object-cover" />
          </div>
          {block.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-4">{block.caption}</figcaption>
          )}
        </figure>
      </AnimatedSection>
    </section>
  );
}

function GalleryBlock({ block }: { block: Block }) {
  const images: any[] = Array.isArray(block.images) ? block.images : [];
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <AnimatedSection key={i} delay={i * 0.08} direction="up">
              <div className="rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                <img src={img?.url} alt={img?.title || ""} className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteBlock({ block }: { block: Block }) {
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <AnimatedSection direction="scale">
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
            "{block.quote}"
          </blockquote>
          {block.attribution && (
            <p className="text-muted-foreground mt-6 text-sm uppercase tracking-[0.3em]">— {block.attribution}</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

function VideoBlock({ block }: { block: Block }) {
  const url = block.videoUrl || getUrl(block.video);
  if (!url) return null;
  const isYoutube = /youtube\.com|youtu\.be/.test(url);
  return (
    <section className="py-16 md:py-24 px-6">
      <AnimatedSection direction="scale">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden aspect-video bg-black">
          {isYoutube ? (
            <iframe src={url.replace("watch?v=", "embed/")} className="w-full h-full" allow="autoplay; fullscreen" />
          ) : (
            <video src={url} controls poster={getUrl(block.poster)} className="w-full h-full object-cover" />
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}

function StatsBlock({ block }: { block: Block }) {
  const stats: any[] = Array.isArray(block.stats) ? block.stats : [];
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        {block.heading && (
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-16 text-center">{block.heading}</h2>
          </AnimatedSection>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.1} direction="up">
              <div className="text-center p-6 rounded-2xl border border-border/50 bg-card">
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter target={Number(s.value) || 0} suffix={s.suffix || ""} />
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TwoColumnBlock({ block }: { block: Block }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <AnimatedSection direction="left">
          {block.image && (
            <div className="rounded-2xl overflow-hidden bg-muted">
              <img src={getUrl(block.image)} alt="" className="w-full h-auto object-cover" />
            </div>
          )}
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          {block.heading && <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{block.heading}</h3>}
          {block.body && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-strong:text-foreground prose-a:text-primary">
              {documentToReactComponents(block.body)}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

export function ProjectBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const type = (block?._type || "").toLowerCase();
        // Match by type id, fall back to field-based detection
        if (type.includes("text") || block.body) return <TextBlock key={block._id || i} block={block} />;
        if (type.includes("gallery") || Array.isArray(block.images)) return <GalleryBlock key={block._id || i} block={block} />;
        if (type.includes("image") || block.image) {
          // If image + body present treat as two-column
          if (block.body || block.heading) return <TwoColumnBlock key={block._id || i} block={block} />;
          return <ImageBlock key={block._id || i} block={block} />;
        }
        if (type.includes("quote") || block.quote) return <QuoteBlock key={block._id || i} block={block} />;
        if (type.includes("video") || block.videoUrl) return <VideoBlock key={block._id || i} block={block} />;
        if (type.includes("stat") || Array.isArray(block.stats)) return <StatsBlock key={block._id || i} block={block} />;
        return null;
      })}
    </>
  );
}
