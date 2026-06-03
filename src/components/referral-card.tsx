import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2, Gift } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function ReferralCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    if (!user?.id) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/?ref=${user.id}`;
  }, [user?.id]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const share = async () => {
    if (!link) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ResumeIQ — Beat the ATS",
          text: "Score your resume with AI in seconds — try ResumeIQ:",
          url: link,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  if (!user?.id) return null;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow">
          <Gift className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold">Invite friends</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your link — when friends sign up through it, they land straight in ResumeIQ.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input readOnly value={link} className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
            <div className="flex gap-2">
              <Button type="button" variant="glass" onClick={copy} className="flex-1 sm:flex-none">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button type="button" variant="hero" onClick={share} className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
