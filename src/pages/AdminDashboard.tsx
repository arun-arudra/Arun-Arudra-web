import GenerationForm from "@/components/admin/GenerationForm";
import ContentGrid from "@/components/admin/ContentGrid";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
          <p className="text-zinc-400 mt-2">Welcome to your secure publishing pipeline.</p>
        </div>
        
        {/* We will add the Content Grid next to this form in the next step! */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GenerationForm />
          </div>

          <div className="lg:col-span-2">
            {/* The new grid goes here! */}
            <ContentGrid />
          </div>
          
          {/* <div className="lg:col-span-2 border border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-950/50">
            <p className="text-zinc-500">Content Grid will go here...</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}