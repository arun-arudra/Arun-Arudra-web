import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function GenerationForm() {
  const [url, setUrl] = useState("");
  const [sourceType, setSourceType] = useState("Topic / Keyword");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Smart Detection Logic
    if (value.includes("youtube.com") || value.includes("youtu.be")) {
      setSourceType("YouTube URL");
    } else if (value.includes("instagram.com")) {
      setSourceType("Instagram URL");
    } else if (value.length > 0) {
      setSourceType("Topic / Keyword");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const webhookUrl = "https://arunarudra-n8n.onrender.com/webhook/generate-draft";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          input: url, // Using 'url' state here
          extraInstructions
        }),
      });

      if (response.ok) {
        toast({
          title: "Draft Initiated! 🚀",
          description: "n8n is generating the post. It will appear in your drafts shortly.",
        });
        setUrl("");
        setExtraInstructions("");
        setSourceType("Topic / Keyword");
      } else {
        throw new Error("Failed to trigger webhook");
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not reach the n8n webhook.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Create New Draft</CardTitle>
        <CardDescription className="text-zinc-400">
          Feed a URL or topic to the AI pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-300">Input URL or Topic</Label>
            <Input 
              placeholder="Paste URL or type topic..." 
              value={url} 
              onChange={(e) => handleUrlChange(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Source Type</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectItem value="YouTube URL">YouTube URL</SelectItem>
                <SelectItem value="Instagram URL">Instagram URL</SelectItem>
                <SelectItem value="Topic / Keyword">Topic / Keyword</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraInstructions" className="text-zinc-300">Extra Instructions (Optional)</Label>
            <Textarea
              id="extraInstructions"
              placeholder="e.g., Focus heavily on the technical setup..."
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting...</> : "Generate Draft"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}