import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import ReviewModal from "./ReviewModal";

export default function ContentGrid() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      
      // Fetch 'news' content type, ordered by newest first
      const response = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=news&order=-sys.updatedAt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (data.items) {
        setEntries(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch Contentful entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // Set up a polling interval to auto-refresh the grid every 10 seconds 
    // so new n8n drafts appear automatically without refreshing the page.
    const interval = setInterval(fetchEntries, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Publishing Queue</CardTitle>
        <CardDescription className="text-zinc-400">
          Review, edit, and approve AI-generated drafts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Title</TableHead>
                  <TableHead className="text-zinc-400">Category</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-right text-zinc-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow className="border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                    <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                      No content found. Generate a draft to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => {
                    // If publishedVersion exists, the post is live. Otherwise, it's a draft.
                    const isPublished = !!entry.sys.publishedVersion;
                    
                    return (
                      <TableRow key={entry.sys.id} className="border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                        <TableCell className="font-medium text-white max-w-[200px] truncate">
                          {entry.fields.title?.['en-US'] || 'Untitled'}
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {entry.fields.category?.['en-US'] || 'Uncategorized'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isPublished ? "default" : "secondary"}
                            className={isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                onClick={() => {
                                    setSelectedEntry(entry);
                                    setIsModalOpen(true);
                                }}
                            >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <ReviewModal 
       entry={selectedEntry} 
       isOpen={isModalOpen} 
       onClose={() => setIsModalOpen(false)} 
     />
    </Card>
  );
}