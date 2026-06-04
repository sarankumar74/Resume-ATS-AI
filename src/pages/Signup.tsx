import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";
import { AuthShell, PhoneAuthForm } from "@/components/auth-shared";
import { SEO } from "@/components/SEO";

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (error) toast.error(error.message ?? "Google sign-in failed");
  };

  return (
    <>
      <SEO
        title="Create your ResumeIQ account — Free AI resume scoring"
        description="Sign up free for ResumeIQ and get instant AI-powered ATS scoring, JD matching, and STAR-format resume rewrites."
        canonical="/signup"
      />
      <AuthShell title="Create your account" subtitle="Start scoring your resume in seconds.">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email"><Mail className="mr-1.5 h-4 w-4" /> Email</TabsTrigger>
            <TabsTrigger value="phone"><Phone className="mr-1.5 h-4 w-4" /> Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-5">
            <EmailSignupForm />
          </TabsContent>
          <TabsContent value="phone" className="mt-5">
            <PhoneAuthForm mode="signup" />
          </TabsContent>
        </Tabs>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="glass" className="w-full h-11" onClick={handleGoogle}>
          Continue with Google
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </AuthShell>
    </>
  );
}

function EmailSignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    setLoading(true);
    const referred_by = localStorage.getItem("resumeiq_ref") ?? undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { username, full_name: username, ...(referred_by ? { referred_by } : {}) },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      try { localStorage.removeItem("resumeiq_ref"); } catch { /* ignore */ }
      toast.success("Check your email to confirm your account.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <div className="relative">
          <Input id="confirm" type={showConfirm ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showConfirm ? "Hide password" : "Show password"}>
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
