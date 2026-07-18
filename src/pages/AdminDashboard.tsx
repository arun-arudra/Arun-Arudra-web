import GenerationForm from "@/components/admin/GenerationForm";
import ContentGrid from "@/components/admin/ContentGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Command Header with New Post Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
            <p className="text-zinc-400 mt-2">Welcome to your secure publishing pipeline.</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/review/new')} 
            className="bg-white text-black hover:bg-zinc-200 font-semibold shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Blank Post
          </Button>
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