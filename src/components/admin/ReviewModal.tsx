import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Send, Clock, Image as ImageIcon } from "lucide-react";

interface ReviewModalProps {
  entry: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ entry, isOpen, onClose }: ReviewModalProps) {
  // Core Content
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  
  // SEO & Meta
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  
  // Stats & Visuals
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      const fields = entry.fields;
      setTitle(fields.title?.['en-US'] || "");
      setSlug(fields.slug?.['en-US'] || "");
      setBody(fields.body?.['en-US'] || "");
      setCategory(fields.category?.['en-US'] || "");
      setTags(fields.tags?.['en-US']?.join(", ") || "");
      setExcerpt(fields.excerpt?.['en-US'] || "");
      setSeoTitle(fields.seoTitle?.['en-US'] || "");
      setSeoDescription(fields.seoDescription?.['en-US'] || "");
      setFocusKeyword(fields.focusKeyword?.['en-US'] || "");
      setWordCount(fields.wordCount?.['en-US'] || 0);
      setReadTime(fields.readTime?.['en-US'] || "");

      // Fetch the actual image URL from Contentful using the Asset ID
      const assetId = fields.coverImage?.['en-US']?.sys?.id;
      if (assetId) {
        fetchAssetUrl(assetId);
      } else {
        setImageUrl(null);
      }
    }
  }, [entry]);

  const fetchAssetUrl = async (assetId: string) => {
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const response = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      const url = data.fields?.file?.['en-US']?.url;
      if (url) setImageUrl(`https:${url}`);
    } catch (error) {
      console.error("Failed to fetch image asset", error);
    }
  };

  // Auto-format slug to be URL-safe (lowercase, hyphens only)
  const handleSlugChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(formatted);
  };

  // Auto-calculate word count and read time on the fly
  const handleBodyChange = (val: string) => {
    setBody(val);
    const words = val.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
    setReadTime(`${Math.ceil(words / 200)} min read`);
  };

  if (!entry) return null;
  const isPublished = !!entry.sys.publishedVersion;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-100 sm:max-w-4xl overflow-y-auto p-0">
        
        {/* Header Section */}
        <div className="p-6 border-b border-zinc-800 bg-black sticky top-0 z-10">
          <SheetHeader className="flex flex-row justify-between items-start">
            <div>
              <SheetTitle className="text-2xl font-bold text-white">
                {isPublished ? "Review Published Post" : "Review Draft"}
              </SheetTitle>
              <SheetDescription className="text-zinc-400 mt-1">
                Verify content, SEO, and imagery before deployment.
              </SheetDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-zinc-900">
                {wordCount} words
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-zinc-900">
                {readTime}
              </Badge>
            </div>
          </SheetHeader>
        </div>

        {/* 2-Column Editor Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Preview - 1920x1080 Aspect Ratio Container */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Cover Image</Label>
              <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-600 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span>No image generated</span>
                  </div>
                )}
                {/* Future Image Swap Button Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-zinc-200">
                    Replace Image
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Post Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-zinc-900 border-zinc-700 text-white font-medium text-lg" />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Markdown Body</Label>
              <Textarea 
                value={body} 
                onChange={(e) => handleBodyChange(e.target.value)} 
                className="bg-zinc-900 border-zinc-700 text-zinc-300 min-h-[500px] font-mono text-sm leading-relaxed" 
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Meta & SEO */}
          <div className="space-y-6">
            <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-4">
              <h3 className="font-semibold text-white border-b border-zinc-800 pb-2">URL & Categorization</h3>
              
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">URL Slug</Label>
                <Input value={slug} onChange={(e) => handleSlugChange(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 font-mono text-xs" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Tags (comma separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm" />
              </div>
            </div>

            <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-4">
              <h3 className="font-semibold text-white border-b border-zinc-800 pb-2">SEO Configuration</h3>
              
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">SEO Title</Label>
                <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Focus Keyword</Label>
                <Input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="bg-zinc-900 border-zinc-800 text-emerald-400 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Excerpt / Meta Description</Label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm min-h-[100px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-black sticky bottom-0 z-10">
          <SheetFooter className="flex-col sm:flex-row gap-3 sm:space-x-0">
            {!isPublished && (
              <Button variant="destructive" className="w-full sm:w-auto bg-red-950 text-red-400 hover:bg-red-900 border border-red-900">
                <Trash2 className="w-4 h-4 mr-2" /> Discard Draft
              </Button>
            )}
            
            <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
              {!isPublished && (
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  <Clock className="w-4 h-4 mr-2" /> Schedule
                </Button>
              )}
              <Button className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-semibold">
                <Send className="w-4 h-4 mr-2" /> {isPublished ? "Save Updates" : "Publish Now"}
              </Button>
            </div>
          </SheetFooter>
        </div>

      </SheetContent>
    </Sheet>
  );
}