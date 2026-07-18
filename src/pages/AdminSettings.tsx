import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, Mail, LogOut, Loader2 } from "lucide-react";
import { MfaManager } from "@/components/admin/MfaManager";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserEmail(user?.email || "");

    const { data: factors } = await supabase.auth.mfa.listFactors();
    setMfaEnabled(factors?.totp.length > 0);
  };

  const toggleMfa = async () => {
    setLoading(true);
    if (mfaEnabled) {
      // Remove existing factor
      const { data: factors } = await supabase.auth.mfa.listFactors();
      for (const factor of factors.totp) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      setMfaEnabled(false);
      toast({ title: "MFA Disabled" });
    } else {
      // Enroll new factor
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setQrCode(data.totp.qr_code);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      <section className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><Mail className="w-4 h-4"/> Profile</h2>
        <Input disabled value={userEmail} className="bg-zinc-900 border-zinc-800" />
      </section>

      <section className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Lock className="w-4 h-4"/> Security</h2>
        
        <div className="flex justify-between items-center p-4 bg-zinc-900 rounded-lg">
           <span>Multi-Factor Authentication</span>
           <MfaManager />
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <Label>New Password</Label>
          <Input type="password" onChange={(e) => setNewPassword(e.target.value)} className="bg-zinc-900 border-zinc-800" />
          <Label>Confirm Password</Label>
          <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="bg-zinc-900 border-zinc-800" />
          <Button onClick={() => { /* Add password logic here */ }} className="w-full">Update Password</Button>
        </div>
      </section>
    </div>
  );
}