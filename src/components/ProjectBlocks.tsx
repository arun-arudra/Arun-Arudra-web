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

function asImageArray(v: any): any[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function isRichTextDoc(v: any): boolean {
  return !!(v && typeof v === "object" && v.nodeType === "document");
}

function RichText({ value }: { value: any }) {
  if (!isRichTextDoc(value)) return null;
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-strong:text-foreground prose-a:text-primary">
      {documentToReactComponents(value)}
    </div>
  );
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
            {isRichTextDoc(block.body) ? (
              <RichText value={block.body} />
            ) : typeof block.body === "string" ? (
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">{block.body}</p>
            ) : null}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ImageBlock({ block }: { block: Block }) {
  const url = getUrl(block.image);
  if (!url) return null;
  const fullBleed = !!(block.fullBleed || block.wide);
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
  // Field can be named `images` (guide) or `image` (current Contentful model)
  const images = asImageArray(block.images ?? block.image ?? block.gallery);
  if (images.length === 0) return null;
  const cols = Number(block.columns) > 0 ? Math.min(4, Number(block.columns)) : 3;
  const gridCols =
    cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className={`grid gap-4 ${gridCols}`}>
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
  const attr = block.attribution || block.author || block.cite;
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <AnimatedSection direction="scale">
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
            "{block.quote}"
          </blockquote>
          {attr && (
            <p className="text-muted-foreground mt-6 text-sm uppercase tracking-[0.3em]">— {attr}</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

function VideoBlock({ block }: { block: Block }) {
  const url = block.videoUrl || block.url || getUrl(block.video);
  if (!url) return null;
  const isYoutube = /youtube\.com|youtu\.be/.test(url);
  const isVimeo = /vimeo\.com/.test(url);
  const embedUrl = isYoutube
    ? url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
    : isVimeo
      ? url.replace("vimeo.com/", "player.vimeo.com/video/")
      : url;
  return (
    <section className="py-16 md:py-24 px-6">
      <AnimatedSection direction="scale">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden aspect-video bg-black">
          {isYoutube || isVimeo ? (
            <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen" />
          ) : (
            <video src={url} controls poster={getUrl(block.poster)} className="w-full h-full object-cover" />
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}

function StatsBlock({ block }: { block: Block }) {
  // Field can be `stats` or `items`
  const stats: any[] = Array.isArray(block.stats)
    ? block.stats
    : Array.isArray(block.items)
      ? block.items
      : [];
  if (stats.length === 0) return null;
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
  // Supports either {image, heading, body} OR {left, right} (both can be rich text or media)
  const leftIsImage = block.left && (Array.isArray(block.left) || block.left.url);
  const rightIsImage = block.right && (Array.isArray(block.right) || block.right.url);
  const leftImg = leftIsImage ? getUrl(block.left) : getUrl(block.image);
  const leftText = !leftIsImage && block.left ? block.left : null;
  const rightText = !rightIsImage && (block.right || block.body) ? (block.right || block.body) : null;
  const rightImg = rightIsImage ? getUrl(block.right) : "";

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <AnimatedSection direction="left">
          {leftImg ? (
            <div className="rounded-2xl overflow-hidden bg-muted">
              <img src={leftImg} alt="" className="w-full h-auto object-cover" />
            </div>
          ) : leftText ? (
            <RichText value={leftText} />
          ) : null}
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          {block.heading && <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">{block.heading}</h3>}
          {rightImg ? (
            <div className="rounded-2xl overflow-hidden bg-muted">
              <img src={rightImg} alt="" className="w-full h-auto object-cover" />
            </div>
          ) : rightText ? (
            <RichText value={rightText} />
          ) : null}
        </AnimatedSection>
      </div>
    </section>
  );
}

export function ProjectBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (!block) return null;
        const type = (block._type || "").toLowerCase();
        const key = block._id || `b-${i}`;

        // 1) Explicit type id wins
        if (type.includes("twocolumn") || type.includes("two_column") || type.includes("two-column"))
          return <TwoColumnBlock key={key} block={block} />;
        if (type.includes("gallery")) return <GalleryBlock key={key} block={block} />;
        if (type.includes("image")) return <ImageBlock key={key} block={block} />;
        if (type.includes("quote")) return <QuoteBlock key={key} block={block} />;
        if (type.includes("video")) return <VideoBlock key={key} block={block} />;
        if (type.includes("stat")) return <StatsBlock key={key} block={block} />;
        if (type.includes("text")) return <TextBlock key={key} block={block} />;

        // 2) Field-shape fallback
        if (block.quote) return <QuoteBlock key={key} block={block} />;
        if (Array.isArray(block.items) || Array.isArray(block.stats)) return <StatsBlock key={key} block={block} />;
        if (block.left || block.right) return <TwoColumnBlock key={key} block={block} />;
        if (block.videoUrl || block.url) return <VideoBlock key={key} block={block} />;
        if (Array.isArray(block.images) || (Array.isArray(block.image) && block.image.length > 1))
          return <GalleryBlock key={key} block={block} />;
        if (block.image) return <ImageBlock key={key} block={block} />;
        if (block.body) return <TextBlock key={key} block={block} />;
        return null;
      })}
    </>
  );
}
