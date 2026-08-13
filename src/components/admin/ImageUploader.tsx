import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

export default function ImageUploader({ onUploadComplete }: { onUploadComplete: (assetId: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

      // 1. Upload Binary
      const uploadRes = await fetch(`https://upload.contentful.com/spaces/${spaceId}/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' },
        body: file
      });
      const uploadData = await uploadRes.json();

      // 2. Create Asset
      const assetRes = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/vnd.contentful.management.v1+json' },
        body: JSON.stringify({
          fields: {
            title: { 'en-US': file.name },
            file: { 'en-US': { contentType: file.type, fileName: file.name, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: uploadData.sys.id } } } }
          }
        })
      });
      const assetData = await assetRes.json();

      // 3. Process Asset
      await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetData.sys.id}/files/en-US/process`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({ title: "Upload Success", description: "Image linked to entry." });
      onUploadComplete(assetData.sys.id);
    } catch (error) {
      toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input type="file" id="image-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
      <Button 
        variant="outline" 
        className="w-full border-zinc-800 text-zinc-300 hover:text-white" 
        onClick={() => document.getElementById('image-upload')?.click()} 
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
        Replace Cover
      </Button>
    </>
  );
}