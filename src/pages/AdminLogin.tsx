import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldCheck, QrCode, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State Management
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'enroll' | 'verify'>('login');
  
  // Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // MFA Data
  const [factorId, setFactorId] = useState("");
  const [qrCodeSvg, setQrCodeSvg] = useState("");

  const handleSkip = () => {
    // Optionally, save a flag in local storage or database so you don't prompt them again immediately
    localStorage.setItem('mfa_skipped', 'true');
    
    // Route directly to the admin page
    navigate('/admin');
  };

  // STEP 1: Handle Initial Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // 1. FIRST, check if they have any MFA factors set up
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactors = factors.totp || [];

      // 2. If NO factors exist, lock them on the page and force enrollment
      if (totpFactors.length === 0) {
        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
        });
        if (enrollError) throw enrollError;

        setFactorId(enrollData.id);
        setQrCodeSvg(enrollData.totp.qr_code);
        setStep('enroll');
        return; // Stop here until they scan the QR code
      }

      // 3. If they DO have factors, check if they are already verified
      const { data: mfaStatus, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaError) throw mfaError;

      if (mfaStatus.currentLevel === 'aal2') {
        // They are fully verified
        navigate("/admin");
      } else {
        // They need to enter their 6-digit code
        setFactorId(totpFactors[0].id);
        setStep('verify');
      }

    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 & 3: Handle Code Verification (For both Setup and Daily Login)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create a challenge
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      // 2. Verify the code against the challenge
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: otpCode,
      });
      if (verifyError) throw verifyError;

      // Success! The session is now upgraded to AAL2
      toast({ title: "Access Granted", description: "MFA Verified successfully." });
      navigate("/admin");

    } catch (error: any) {
      toast({ title: "Verification Failed", description: "Invalid code. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background styling to match your dark theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
      
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>
        </div>

        {step === 'login' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-zinc-400 text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="bg-zinc-900 border-zinc-800" placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="bg-zinc-900 border-zinc-800" placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </div>
        )}

        {step === 'enroll' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-amber-500">MFA Required</h1>
              <p className="text-zinc-400 text-sm">Two-factor authentication is mandatory. Please set it up now.</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <QrCode className="w-6 h-6 text-zinc-500 mb-4" />
              <div 
                className="bg-white p-2 rounded-lg"
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }} 
              />
              <p className="text-xs text-zinc-500 text-center mt-4">
                Scan this code using Google Authenticator, Authy, or your preferred TOTP app.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <Input 
                  type="text" required maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-center text-xl tracking-widest" placeholder="123456"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 text-white hover:bg-amber-700" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Verify & Activate MFA
              </Button>
              <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Two-Factor Authentication</h1>
              <p className="text-zinc-400 text-sm">Open your authenticator app and enter the code.</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" required maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-center text-2xl tracking-[0.5em] py-6 font-mono" 
                  placeholder="000000" autoFocus
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Authenticate
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}