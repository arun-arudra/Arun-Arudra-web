import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2, Send, Clock, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ReviewPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const entry = location.state?.entry;

  // Core Content
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
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
  const [readTime, setReadTime] = useState("0 min read");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const calculateStats = (text: string) => {
    if (!text) {
      setWordCount(0);
      setReadTime("0 min read");
      return;
    }
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
    setReadTime(`${Math.ceil(words / 200)} min read`);
  };

  useEffect(() => {
    if (!entry) {
      navigate('/admin');
      return;
    }

    const fields = entry.fields;
    setTitle(fields.title?.['en-US'] || "Untitled Post");
    setSlug(fields.slug?.['en-US'] || "");
    
    const bodyText = fields.body?.['en-US'] || "";
    setBody(bodyText);
    calculateStats(bodyText);

    setCategory(fields.category?.['en-US'] || "");
    setTags(fields.tags?.['en-US']?.join(", ") || "");
    setExcerpt(fields.excerpt?.['en-US'] || "");
    setSeoTitle(fields.seoTitle?.['en-US'] || "");
    setSeoDescription(fields.seoDescription?.['en-US'] || "");
    setFocusKeyword(fields.focusKeyword?.['en-US'] || "");

    const assetId = fields.coverImage?.['en-US']?.sys?.id;
    if (assetId) {
      fetchAssetUrl(assetId);
    } else {
      setImageUrl(null);
    }
  }, [entry, navigate]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

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

  const handleSlugChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(formatted);
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    calculateStats(val);
  };

  // --- API ACTIONS ---

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const entryId = entry.sys.id;
      let currentVersion = entry.sys.version;

      // Prepare updated fields, preserving any existing image links
      const updatedFields = {
        ...entry.fields,
        title: { 'en-US': title },
        slug: { 'en-US': slug },
        body: { 'en-US': body },
        category: { 'en-US': category },
        tags: { 'en-US': tags.split(',').map(t => t.trim()).filter(Boolean) },
        excerpt: { 'en-US': excerpt },
        seoTitle: { 'en-US': seoTitle },
        seoDescription: { 'en-US': excerpt }, // Mirroring excerpt for meta description
        focusKeyword: { 'en-US': focusKeyword },
        wordCount: { 'en-US': wordCount },
        readTime: { 'en-US': readTime },
      };

      // STEP 1: Update the Entry
      const updateRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': currentVersion.toString()
        },
        body: JSON.stringify({ fields: updatedFields })
      });

      if (!updateRes.ok) throw new Error('Failed to save updates');
      const updateData = await updateRes.json();
      
      // Contentful increments the version number after an update
      currentVersion = updateData.sys.version; 

      // STEP 2: Publish the Entry
      const publishRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}/published`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Contentful-Version': currentVersion.toString()
        }
      });

      if (!publishRes.ok) throw new Error('Failed to publish entry');

      toast({
        title: "Success! 🚀",
        description: "Your post is now live.",
      });
      
      // Return to dashboard
      navigate('/admin');

    } catch (error) {
      console.error(error);
      toast({
        title: "Publishing Error",
        description: "Something went wrong saving the post to Contentful.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscard = async () => {
    if (!confirm("Are you sure you want to permanently delete this draft?")) return;
    
    setIsDiscarding(true);
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const entryId = entry.sys.id;
      const currentVersion = entry.sys.version;

      const deleteRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Contentful-Version': currentVersion.toString()
        }
      });

      if (!deleteRes.ok) throw new Error('Failed to delete entry');

      toast({
        title: "Draft Discarded",
        description: "The draft was permanently removed from your space.",
      });
      navigate('/admin');

    } catch (error) {
      console.error(error);
      toast({
        title: "Deletion Error",
        description: "Could not discard the draft.",
        variant: "destructive"
      });
    } finally {
      setIsDiscarding(false);
    }
  };

  if (!entry) return null;
  const isPublished = !!entry.sys.publishedVersion;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Top Command Bar */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin')}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 min-w-0 pr-4">
              {isEditingTitle ? (
                <Input 
                  ref={titleInputRef}
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  className="bg-zinc-900 border-zinc-700 text-white font-bold text-lg h-9 w-full lg:max-w-2xl" 
                />
              ) : (
                <h1 
                  onClick={() => setIsEditingTitle(true)}
                  className="text-lg font-bold text-white truncate cursor-text hover:bg-zinc-800/50 py-1 px-2 rounded-md transition-colors lg:max-w-2xl inline-block"
                  title="Click to edit title"
                >
                  {title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isPublished && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleDiscard}
                  disabled={isDiscarding || isProcessing}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                >
                  {isDiscarding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Discard
                </Button>
                <Button variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  <Clock className="w-4 h-4 mr-2" /> Schedule
                </Button>
              </>
            )}
            <Button 
              onClick={handlePublish}
              disabled={isProcessing || isDiscarding}
              className="bg-white text-black hover:bg-zinc-200 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> {isPublished ? "Save Updates" : "Publish Now"}</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Badge variant={isPublished ? "default" : "secondary"} className={isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-sm text-zinc-400 font-mono">{wordCount} words</span>
          <span className="text-sm text-zinc-400 font-mono">&bull;</span>
          <span className="text-sm text-zinc-400 font-mono">{readTime}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <Label className="text-zinc-300 text-base font-semibold">Cover Image (1920x1080)</Label>
              <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-600 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span>Loading or missing image...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Button variant="secondary" className="bg-white text-black hover:bg-zinc-200">
                    Upload Replacement
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300 text-base font-semibold">Markdown Body</Label>
              <Textarea 
                value={body} 
                onChange={(e) => handleBodyChange(e.target.value)} 
                className="bg-zinc-900/50 border-zinc-800 text-zinc-300 min-h-[600px] font-mono text-sm leading-relaxed p-6 rounded-xl resize-y" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-5">
              <h3 className="font-semibold text-white text-lg">Taxonomy</h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">URL SLUG</Label>
                <Input value={slug} onChange={(e) => handleSlugChange(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 font-mono text-xs h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">CATEGORY</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">TAGS (COMMA SEPARATED)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9 text-sm" />
              </div>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-5">
              <h3 className="font-semibold text-white text-lg">Search Optimization</h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">SEO TITLE</Label>
                <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 h-9 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">FOCUS KEYWORD</Label>
                <Input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="bg-zinc-900 border-emerald-900/50 text-emerald-400 font-medium h-9 text-sm focus-visible:ring-emerald-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">EXCERPT / META DESCRIPTION</Label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm min-h-[120px] resize-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}