import { useState, useEffect } from "react";
import GenerationForm from "@/components/admin/GenerationForm";
import ContentGrid from "@/components/admin/ContentGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart2 } from "lucide-react";
import UserMenu from "@/components/admin/UserMenu";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // NEW: Stats State
  const [stats, setStats] = useState({ published: 0, drafts: 0 });

  // NEW: Fetch Stats from Contentful
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
        const token = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
        
        // Fetch ALL news entries (minimal data payload to count them)
        const res = await fetch(
          `https://api.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=news&select=sys.id,sys.publishedVersion`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const data = await res.json();
        if (data.items) {
          let pubCount = 0;
          let draftCount = 0;
          data.items.forEach((item: any) => {
            if (item.sys.publishedVersion) pubCount++;
            else draftCount++;
          });
          setStats({ published: pubCount, drafts: draftCount });
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Command Header with New Post Button */}
        {/* Command Header with New Post Button & Live Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Command Center
              <span className="text-sm font-normal bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300">{stats.published} Published &bull; {stats.drafts} Drafts</span>
              </span>
            </h1>
            <p className="text-zinc-400 mt-2">Welcome to your secure publishing pipeline.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button 
              onClick={() => navigate('/admin/review/new')} 
              className="bg-white text-black hover:bg-zinc-200 font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Blank Post
            </Button>
            <UserMenu />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GenerationForm />
          </div>
          <div className="lg:col-span-2">
            <ContentGrid />
          </div>
        </div>
      </div>
    </div>
  );
}