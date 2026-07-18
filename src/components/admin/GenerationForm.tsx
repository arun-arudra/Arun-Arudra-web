import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export default function GenerationForm() {
  const [sourceType, setSourceType] = useState("YouTube URL");
  const [inputVal, setInputVal] = useState("");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Your active 24/7 Production Webhook
      const webhookUrl = "https://arunarudra-n8n.onrender.com/webhook/generate-draft";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceType,
          input: inputVal,
          extraInstructions
        }),
      });

      if (response.ok) {
        toast({
          title: "Draft Initiated! 🚀",
          description: "n8n is generating the post. It will appear in your drafts shortly.",
        });
        // Clear the form fields after a successful send
        setInputVal("");
        setExtraInstructions("");
      } else {
        throw new Error("Failed to trigger webhook");
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not reach the n8n webhook. Ensure the workflow is active.",
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
            <Label htmlFor="inputVal" className="text-zinc-300">Input URL or Topic</Label>
            <Input
              id="inputVal"
              placeholder={sourceType === "Topic / Keyword" ? "e.g., The future of smart homes" : "Paste URL here..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraInstructions" className="text-zinc-300">Extra Instructions (Optional)</Label>
            <Textarea
              id="extraInstructions"
              placeholder="e.g., Focus heavily on the technical setup, maintain a humorous tone..."
              value={extraInstructions}
              onChange={(e) => setExtraInstructions(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500 min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-zinc-200 transition-colors font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? "Transmitting to n8n..." : "Generate Draft"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}