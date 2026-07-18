import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Send, Clock } from "lucide-react";

interface ReviewModalProps {
  entry: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ entry, isOpen, onClose }: ReviewModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");

  // Populate the form fields whenever a new entry is selected
  useEffect(() => {
    if (entry) {
      setTitle(entry.fields.title?.['en-US'] || "");
      setSlug(entry.fields.slug?.['en-US'] || "");
      setBody(entry.fields.body?.['en-US'] || "");
    }
  }, [entry]);

  if (!entry) return null;

  const isPublished = !!entry.sys.publishedVersion;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-100 sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white">
            {isPublished ? "Review Published Post" : "Review Draft"}
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            Make final tweaks to the AI-generated content before pushing it live.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-300">Post Title</Label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">URL Slug</Label>
            <Input 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-zinc-400 focus-visible:ring-zinc-500 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Markdown Body</Label>
            <Textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-zinc-500 min-h-[400px] font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        <SheetFooter className="mt-8 flex-col sm:flex-row gap-3 sm:space-x-0">
          {!isPublished && (
            <Button variant="destructive" className="w-full sm:w-auto bg-red-950 text-red-400 hover:bg-red-900 border border-red-900">
              <Trash2 className="w-4 h-4 mr-2" />
              Discard Draft
            </Button>
          )}
          
          <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
            {!isPublished && (
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            )}
            <Button className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-semibold">
              <Send className="w-4 h-4 mr-2" />
              {isPublished ? "Save Updates" : "Publish Now"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}