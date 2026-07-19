import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Search, Loader2 } from "lucide-react";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function ContentGrid() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(import.meta.env.VITE_PAGE_LIMIT || "10", 10));
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("-sys.updatedAt");
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      const skip = currentPage * rowsPerPage;
      
      let url = `https://api.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=news&order=${sortField}&skip=${skip}&limit=${rowsPerPage}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;

      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      
      setEntries(data.items || []);
      setTotalEntries(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
      const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
      await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'X-Contentful-Version': '0' }
      });
      toast({ title: "Entry Deleted", description: "The content has been removed." });
      setEntries(entries.filter(e => e.sys.id !== deleteId));
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete entry.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(fetchEntries, 300);
    return () => clearTimeout(handler);
  }, [currentPage, rowsPerPage, sortField, search]);

  const toggleSort = (field: string) => {
    setSortField(prev => prev === field ? `-${field}` : field);
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Publishing Queue</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search posts..." 
            className="pl-9 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 cursor-pointer hover:text-white" onClick={() => toggleSort("fields.title")}>Title <ArrowUpDown className="w-3 h-3 inline" /></TableHead>
                <TableHead className="text-zinc-400 cursor-pointer hover:text-white" onClick={() => toggleSort("fields.category")}>Category <ArrowUpDown className="w-3 h-3 inline" /></TableHead>
                <TableHead className="text-zinc-400 cursor-pointer hover:text-white" onClick={() => toggleSort("sys.publishedVersion")}>Status <ArrowUpDown className="w-3 h-3 inline" /></TableHead>
                <TableHead className="text-zinc-400 cursor-pointer hover:text-white" onClick={() => toggleSort("sys.updatedAt")}>Published Date <ArrowUpDown className="w-3 h-3 inline" /></TableHead>
                <TableHead className="text-right text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
              ) : entries.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-500">No content found.</TableCell></TableRow>
              ) : entries.map((entry) => {
                const isPublished = !!entry.sys.publishedVersion;
                const pubDate = entry.sys.publishedAt ? new Date(entry.sys.publishedAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A";
                return (
                  <TableRow key={entry.sys.id} className="border-zinc-800 hover:bg-zinc-900/50">
                    <TableCell className="font-medium">{entry.fields.title?.['en-US'] || 'Untitled'}</TableCell>
                    <TableCell className="text-zinc-400">{entry.fields.category?.['en-US'] || '—'}</TableCell>
                    <TableCell>
                      <Badge className={isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
                        {isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{pubDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/review/${entry.sys.id}`, { state: { entry } })}><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => setDeleteId(entry.sys.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select className="bg-zinc-900 border border-zinc-800 rounded p-1 text-white" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(0); }}>
              {[5, 10, 25, 50].map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>{currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, totalEntries)} of {totalEntries}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="outline" className="border-zinc-800" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" className="border-zinc-800" onClick={() => setCurrentPage(p => p + 1)} disabled={(currentPage + 1) * rowsPerPage >= totalEntries}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete this post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-900 hover:bg-red-800">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}