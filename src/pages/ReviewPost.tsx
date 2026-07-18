import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Send, Clock, Image as ImageIcon, Loader2, Save } from "lucide-react";

export default function ReviewPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const entry = location.state?.entry;

  // Core Content State
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  
  // SEO & Meta State
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  
  // Stats & Visuals State
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("0 min read");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Processing & Error UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (!entry && id !== 'new') {
      navigate('/admin');
      return;
    }

    if (entry) {
      const fields = entry.fields;
      setTitle(fields.title?.['en-US'] || "");
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

      const assetId = fields.coverImage?.['en-US']?.sys?.id || fields.image?.['en-US']?.sys?.id;
      if (assetId) fetchAssetUrl(assetId);
    } else {
      setTitle("New Blank Post");
      setSlug(`draft-${Date.now()}`);
    }
  }, [entry, id, navigate]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) titleInputRef.current.focus();
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
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    calculateStats(val);
  };

  const prepareFieldsPayload = () => {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    // Assembling complete payload matching your Contentful Schema explicitly
    const updatedFields: any = {
      title: { 'en-US': title || 'Untitled' },
      slug: { 'en-US': slug || `untitled-${Date.now()}` },
      body: { 'en-US': body },
      category: { 'en-US': category || 'Uncategorized' },
      excerpt: { 'en-US': excerpt },
      seoTitle: { 'en-US': seoTitle },
      seoDescription: { 'en-US': seoDescription || excerpt },
      focusKeyword: { 'en-US': focusKeyword },
      wordCount: { 'en-US': wordCount },
      readTime: { 'en-US': readTime },
      // Adding missing parameters n8n handles to fulfill validation
      featured: { 'en-US': entry?.fields?.featured?.['en-US'] ?? false },
      publishedDate: { 'en-US': entry?.fields?.publishedDate?.['en-US'] || new Date().toISOString() }
    };

    if (tagArray.length > 0) updatedFields.tags = { 'en-US': tagArray };

    if (entry?.fields) {
      if (entry.fields.image) updatedFields.image = entry.fields.image;
      if (entry.fields.coverImage) updatedFields.coverImage = entry.fields.coverImage;
    }

    return updatedFields;
  };

  const saveEntry = async (publishAfter: boolean) => {
    setIsProcessing(true);
    setFieldErrors({});
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const updatedFields = prepareFieldsPayload();
      
      let currentVersion = entry?.sys?.version || 1;
      let entryId = entry?.sys?.id;

      // STEP 1: CREATE OR UPDATE DRAFT
      if (id === 'new' && !entryId) {
        const createRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'X-Contentful-Content-Type': 'news'
          },
          body: JSON.stringify({ fields: updatedFields })
        });
        const createData = await createRes.json();
        
        if (!createRes.ok) {
          handleApiErrors(createData);
          return;
        }
        entryId = createData.sys.id;
        currentVersion = createData.sys.version;
        window.history.replaceState({ entry: createData }, '', `/admin/review/${entryId}`);
      } else {
        const updateRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'X-Contentful-Version': currentVersion.toString()
          },
          body: JSON.stringify({ fields: updatedFields })
        });
        const updateData = await updateRes.json();
        
        if (!updateRes.ok) {
          handleApiErrors(updateData);
          return;
        }
        currentVersion = updateData.sys.version;
      }

      // STEP 2: PUBLISH ENTRY LIVE
      if (publishAfter) {
        const publishRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${entryId}/published`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Contentful-Version': currentVersion.toString()
          }
        });
        
        if (!publishRes.ok) {
          const publishData = await publishRes.json();
          handleApiErrors(publishData);
          return;
        }

        toast({ title: "Success! 🚀", description: "Your post is now live." });
        navigate('/admin');
      } else {
        toast({ title: "Draft Saved 💾", description: "Your progress has been safely stored." });
      }

    } catch (error: any) {
      toast({
        title: "Contentful Operation Error",
        description: error.message || "Failed to update entry schema.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiErrors = (data: any) => {
    if (data.details?.errors) {
      const newErrors: Record<string, string> = {};
      data.details.errors.forEach((err: any) => {
        const fieldPath = err.path ? err.path[1] : 'general';
        newErrors[fieldPath] = err.details || err.name;
      });
      setFieldErrors(newErrors);
      toast({
        title: "Validation Failure",
        description: "Review highlighted elements causing schema mismatch.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Server Error",
        description: data.message || "Action could not be executed.",
        variant: "destructive"
      });
    }
  };

  const handleDiscard = async () => {
    if (id === 'new' && !entry?.sys?.id) {
      navigate('/admin');
      return;
    }

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

      if (!deleteRes.ok) throw new Error('Failed to purge resource');

      setIsDeleteDialogOpen(false);
      toast({ title: "Post Discarded", description: `"${title}" has been expunged.` });
      navigate('/admin');
    } catch (error: any) {
      toast({ title: "Purge Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDiscarding(false);
    }
  };

  const getBorderClass = (fieldName: string) => 
    `bg-zinc-900 border ${fieldErrors[fieldName] ? 'border-red-500 ring-1 ring-red-500 focus-visible:ring-red-500' : 'border-zinc-800 focus-visible:ring-zinc-700'} text-white placeholder:text-zinc-600`;

  const isPublished = !!entry?.sys?.publishedVersion;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to discard this post?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete your work from Contentful. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDiscard(); }} 
              className="bg-red-900 text-red-100 hover:bg-red-800 border border-red-800"
            >
              {isDiscarding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Control Bar */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0 pr-4">
              {isEditingTitle ? (
                <Input 
                  ref={titleInputRef} value={title} onChange={(e) => setTitle(e.target.value)} 
                  onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  className="bg-zinc-900 border-zinc-700 text-white font-bold text-lg h-9 w-full lg:max-w-2xl" 
                />
              ) : (
                <h1 
                  onClick={() => setIsEditingTitle(true)}
                  className="text-lg font-bold text-white truncate cursor-text hover:bg-zinc-800/50 py-1 px-2 rounded-md transition-colors lg:max-w-2xl inline-block"
                >
                  {title || "Untitled Post"}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isPublished && (
              <>
                <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDiscarding || isProcessing} className="text-red-400 hover:text-red-300 hover:bg-red-950/50">
                  <Trash2 className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  <Clock className="w-4 h-4 mr-2" /> Schedule
                </Button>
                <Button variant="outline" onClick={() => saveEntry(false)} disabled={isProcessing || isDiscarding} className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800">
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Draft
                </Button>
              </>
            )}
            <Button onClick={() => saveEntry(true)} disabled={isProcessing || isDiscarding} className="bg-white text-black hover:bg-zinc-200 font-semibold">
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} Publish Now
            </Button>
          </div>
        </div>
      </div>

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
              <Label className="text-zinc-300 text-base font-semibold">Cover Image</Label>
              <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-600 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span>Visual placeholder mapping...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300 text-base font-semibold">Markdown Body</Label>
              <Textarea 
                value={body} onChange={(e) => handleBodyChange(e.target.value)} 
                className={`${getBorderClass('body')} min-h-[600px] font-mono leading-relaxed p-6 rounded-xl resize-y`} 
              />
              {fieldErrors.body && <p className="text-red-500 text-xs mt-1">{fieldErrors.body}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-5">
              <h3 className="font-semibold text-white text-lg">Taxonomy</h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">URL SLUG</Label>
                <Input value={slug} onChange={(e) => handleSlugChange(e.target.value)} className={getBorderClass('slug')} />
                {fieldErrors.slug && <p className="text-red-500 text-xs mt-1">{fieldErrors.slug}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">CATEGORY</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} className={getBorderClass('category')} />
                {fieldErrors.category && <p className="text-red-500 text-xs mt-1">{fieldErrors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">TAGS (COMMA SEPARATED)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} className={getBorderClass('tags')} />
                {fieldErrors.tags && <p className="text-red-500 text-xs mt-1">{fieldErrors.tags}</p>}
              </div>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-5">
              <h3 className="font-semibold text-white text-lg">Search Optimization</h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">SEO TITLE</Label>
                <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={getBorderClass('seoTitle')} />
                {fieldErrors.seoTitle && <p className="text-red-500 text-xs mt-1">{fieldErrors.seoTitle}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">FOCUS KEYWORD</Label>
                <Input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className={getBorderClass('focusKeyword')} />
                {fieldErrors.focusKeyword && <p className="text-red-500 text-xs mt-1">{fieldErrors.focusKeyword}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">EXCERPT / META DESCRIPTION</Label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={`${getBorderClass('excerpt')} min-h-[120px] resize-none`} />
                {fieldErrors.excerpt && <p className="text-red-500 text-xs mt-1">{fieldErrors.excerpt}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}