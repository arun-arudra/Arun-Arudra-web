import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-800"
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline">Account</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-50">
          <button 
            onClick={() => navigate("/admin/settings")} 
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}