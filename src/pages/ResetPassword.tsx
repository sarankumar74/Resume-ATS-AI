import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shared";
import { SEO } from "@/components/SEO";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase puts ?type=recovery in the URL hash after the magic link
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setIsRecovery(true);

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email for the reset link.");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <SEO title="Reset your password — ResumeIQ" canonical="/reset-password" />
      <AuthShell
        title={isRecovery ? "Set a new password" : "Reset your password"}
        subtitle={isRecovery ? "Choose a strong password to finish recovery." : "We'll email you a reset link."}
      >
        {isRecovery ? (
          <form onSubmit={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newpass">New password</Label>
              <Input id="newpass" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        ) : (
          <form onSubmit={sendReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="hover:underline">Back to sign in</Link>
            </p>
          </form>
        )}
      </AuthShell>
    </>
  );
}
