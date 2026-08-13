import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function MfaManager({ onVerifySuccess }: { onVerifySuccess?: () => void }) {
  const [factor, setFactor] = useState<any>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchFactors();
  }, []);

  const fetchFactors = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data.totp.find(f => f.status === 'verified');
    setFactor(verified);
  };

  const startEnrollment = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setFactor({ id: data.id, status: 'unverified' });
    setQrCodeSvg(data.totp.qr_code);
  };

  const verifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    const challenge = await supabase.auth.mfa.challenge({ factorId: factor.id });
    const { error } = await supabase.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challenge.data.id,
      code: otpCode,
    });

    if (error) return toast({ title: "Invalid Code", variant: "destructive" });
    toast({ title: "MFA Connected Successfully" });
    fetchFactors();
    if (onVerifySuccess) onVerifySuccess();
  };

  if (factor?.status === 'verified') {
    return <div className="text-green-500">MFA is Connected ✅</div>;
  }

  if (qrCodeSvg) {
    return (
      <form onSubmit={verifyMfa} className="space-y-4">
        <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
        <Input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter 6-digit code" />
        <Button type="submit">Verify & Link</Button>
      </form>
    );
  }

  return <Button onClick={startEnrollment}>Enable MFA</Button>;
}