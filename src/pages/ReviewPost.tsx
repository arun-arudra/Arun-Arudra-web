import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "@/components/admin/ImageUploader";
import { Sun, Moon } from "lucide-react"; 
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Send, Clock, Image as ImageIcon, Loader2, Save, X } from "lucide-react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserMenu from "@/components/admin/UserMenu";


// ─── Markdown → HTML converter ────────────────────────────────────────────────
// n8n generates body content as Markdown. ReactQuill expects HTML.
// This converts stored markdown to HTML when loading an entry for editing.
function markdownToHtml(md: string): string {
  if (!md || typeof md !== 'string') return '';
  // If it already looks like HTML (starts with a tag), return as-is
  if (/^\s*<[a-zA-Z]/.test(md)) return md;

  let html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Headings (### before ## before #)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Bullet lists
  html = html.replace(/((?:^[-*+] .+\n?)+)/gm, (match: string) => {
    const items = match.trim().split('\n')
      .filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^[-*+]\s+/, '').trim()}</li>`)
      .join('');
    return `<ul>${items}</ul>\n`;
  });

  // Numbered lists
  html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, (match: string) => {
    const items = match.trim().split('\n')
      .filter((l: string) => l.trim())
      .map((l: string) => `<li>${l.replace(/^\d+\.\s+/, '').trim()}</li>`)
      .join('');
    return `<ol>${items}</ol>\n`;
  });

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Wrap double-newline-separated blocks in <p> tags
  const blocks = html.split(/\n\n+/);
  html = blocks.map((block: string) => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|blockquote|hr|div|p)/.test(block)) return block;
    block = block.replace(/\n/g, '<br>');
    return `<p>${block}</p>`;
  }).filter(Boolean).join('\n');

  return html;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [entry, setEntry] = useState(location.state?.entry);

  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("0 min read");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [editorTheme, setEditorTheme] = useState<'dark' | 'light'>('dark');

  const quillRef = useRef<ReactQuill>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [contentfulAssets, setContentfulAssets] = useState<any[]>([]);

  const fetchExistingAssets = async () => {
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const res = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets?order=-sys.createdAt`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setContentfulAssets(data.items);
    } catch (error) {
      console.error("Failed to load existing assets", error);
    }
  };

  const getAssetUrlById = async (assetId: string): Promise<string> => {
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const response = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      return `https:${data.fields?.file?.['en-US']?.url}`;
    } catch (error) {
      console.error("Failed to fetch image URL", error);
      return "";
    }
  };

  const insertImageIntoEditor = async (assetId: string) => {
    const url = await getAssetUrlById(assetId);
    if (!url) return;

    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true); 
      quill.insertEmbed(range.index, 'image', url); 
      quill.setSelection(range.index + 1, 0); 
    }
    setIsMediaModalOpen(false);
    toast({ title: "Image Inserted", description: "Media successfully added to the post." });
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => {
          fetchExistingAssets();
          setIsMediaModalOpen(true);
        }
      }
    }
  }), []);

  const calculateStats = (text: string) => {
    if (!text) {
      setWordCount(0);
      setReadTime("0 min read");
      return;
    }
    const plainText = text.replace(/<[^>]*>?/gm, '');
    const words = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
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
      const rawBody = fields.body?.['en-US'] || "";
      const bodyText = markdownToHtml(rawBody);
      setBody(bodyText);
      calculateStats(bodyText);
      setCategory(fields.category?.['en-US'] || "");
      setTags(fields.tags?.['en-US']?.join(", ") || "");
      setExcerpt(fields.excerpt?.['en-US'] || "");
      setSeoTitle(fields.seoTitle?.['en-US'] || "");
      setSeoDescription(fields.seoDescription?.['en-US'] || "");
      setFocusKeyword(fields.focusKeyword?.['en-US'] || "");

      const assetId = fields.coverImage?.['en-US']?.sys?.id || fields.image?.['en-US']?.sys?.id;
      if (assetId) fetchCoverAssetUrl(assetId);
    } else {
      setTitle("New Blank Post");
      setSlug(`draft-${Date.now()}`);
    }
  }, [entry, id, navigate]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [isEditingTitle]);

  const fetchCoverAssetUrl = async (assetId: string) => {
    const url = await getAssetUrlById(assetId);
    if (url) setImageUrl(url);
  };

  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
  };

  const handleBodyChange = (html: string) => {
    setBody(html);
    calculateStats(html);
  };

  const prepareFieldsPayload = () => {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
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

      if (publishAfter) {
        const assetId = updatedFields.coverImage?.['en-US']?.sys?.id;
        if (assetId) {
          try {
            const assetRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const assetData = await assetRes.json();
            
            await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`, {
              method: 'PUT',
              headers: { 
                'Authorization': `Bearer ${token}`, 
                'X-Contentful-Version': assetData.sys.version.toString() 
              }
            });
          } catch (e) {
            console.error("Could not publish asset, but continuing to publish entry...");
          }
        }

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

        toast({ title: "Published! 🚀", description: "Your post is now live." });
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
    <div className="min-h-screen bg-black text-white pb-20 relative">
      
      {/* MEDIA LIBRARY MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold">Media Library</h2>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col p-6 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Option 1: Upload New Image</h3>
                <div className="w-full max-w-md">
                  <ImageUploader 
                    onUploadComplete={async (newAssetId) => {
                      toast({ title: "Processing...", description: "Inserting newly uploaded image." });
                      await insertImageIntoEditor(newAssetId);
                    }} 
                  />
                </div>
              </div>

              <div className="w-full h-px bg-zinc-800" />

              <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Option 2: Select Existing Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pr-2 pb-10">
                  {contentfulAssets.map((asset: any) => {
                    const url = asset.fields?.file?.['en-US']?.url;
                    if (!url) return null;
                    return (
                      <div 
                        key={asset.sys.id} 
                        onClick={() => insertImageIntoEditor(asset.sys.id)}
                        className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-white hover:ring-2 hover:ring-zinc-700 transition-all group"
                      >
                        <img src={`https:${url}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Contentful Asset" />
                      </div>
                    );
                  })}
                  {contentfulAssets.length === 0 && <p className="text-zinc-500 col-span-full">Loading existing media...</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCARD DIALOG */}
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
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
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
            <UserMenu />
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
              <div className="flex justify-between items-end">
                <Label className="text-zinc-300 text-base font-semibold">Body Content (Rich Text)</Label>
                <span className={`text-xs ${body.replace(/<[^>]*>?/gm, '').length > 50000 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {body.replace(/<[^>]*>?/gm, '').length} / 50000 characters
                </span>
              </div>

              {/* WYSIWYG EDITOR - Fixed Background Conflict & Theme classes */}
              <div className={`relative border border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200 ${editorTheme === 'dark' ? 'editor-dark' : 'editor-light'}`}>
                
                {/* Fixed placement native toggle button directly inside the container */}
                <button 
                  type="button"
                  onClick={() => setEditorTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                  className={`absolute top-2 right-4 z-10 p-1.5 rounded-md transition-colors ${editorTheme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-black hover:bg-zinc-200'}`}
                  title={`Switch to ${editorTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {editorTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={body} 
                  onChange={handleBodyChange} 
                  modules={modules} 
                  
                />
              </div>
              {fieldErrors.body && <p className="text-red-500 text-xs mt-1">{fieldErrors.body}</p>}
            </div>
          </div>

          <div className="space-y-6">
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
              <ImageUploader 
                onUploadComplete={async (newAssetId) => {
                  setEntry((prev: any) => ({
                    ...prev,
                    fields: {
                      ...prev.fields,
                      coverImage: { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: newAssetId } } }
                    }
                  }));
                  await fetchCoverAssetUrl(newAssetId); 
                  toast({ title: "Image Uploaded", description: "Cover image updated in draft." });
                }} 
              />
            </div>
            
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