import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScanLine } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-hero p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <ScanLine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Resume<span className="text-gradient">IQ</span></span>
        </Link>
        <div className="glass rounded-2xl p-8 shadow-elegant">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function PhoneAuthForm({ mode }: { mode: "login" | "signup" }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalize = (v: string) => (v.startsWith("+") ? v : `+${v.replace(/[^\d]/g, "")}`);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalize(phone),
      options: { shouldCreateUser: mode === "signup" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Verification code sent");
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: normalize(phone),
      token: code,
      type: "sms",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(mode === "signup" ? "Account verified!" : "Welcome back!");
  };

  if (!sent) {
    return (
      <form onSubmit={sendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number</Label>
          <Input
            id="phone"
            type="tel"
            required
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Include country code, e.g. +1, +44, +91.</p>
        </div>
        <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
          {loading ? "Sending…" : "Send verification code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">6-digit code</Label>
        <Input
          id="code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <p className="text-xs text-muted-foreground">Sent to {normalize(phone)}.</p>
      </div>
      <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
        {loading ? "Verifying…" : "Verify & continue"}
      </Button>
      <button
        type="button"
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
        onClick={() => { setSent(false); setCode(""); }}
      >
        Use a different number
      </button>
    </form>
  );
}
