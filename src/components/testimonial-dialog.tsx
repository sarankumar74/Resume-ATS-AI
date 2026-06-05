import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function TestimonialDialog({ scanId }: { scanId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !scanId) return;
    const key = `tm_prompted_${scanId}`;
    if (localStorage.getItem(key)) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("testimonials")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (!data) {
        setName(
          (user.user_metadata?.username as string) ||
            (user.user_metadata?.full_name as string) ||
            (user.email ? user.email.split("@")[0] : "")
        );
        setOpen(true);
      }
      localStorage.setItem(key, "1");
    })();
  }, [user, scanId]);

  const submit = async () => {
    if (!user) return;
    if (message.trim().length < 5) return toast.error("Please write a few words.");
    if (!name.trim()) return toast.error("Please add a display name.");
    setBusy(true);
    try {
      const { error } = await (supabase as any).from("testimonials").insert({
        user_id: user.id,
        scan_id: scanId,
        display_name: name.trim(),
        rating,
        message: message.trim(),
        avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
      });
      if (error) throw error;
      toast.success("Thanks for sharing your feedback!");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not submit");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enjoying ResumeIQ?</DialogTitle>
          <DialogDescription>Leave a quick review — it helps others discover us.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    n <= (hover || rating) ? "fill-warning text-warning" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-name">Display name</Label>
            <Input id="tm-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-msg">Your review</Label>
            <Textarea
              id="tm-msg"
              rows={4}
              maxLength={1000}
              placeholder="What did you like?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="glass" onClick={() => setOpen(false)} disabled={busy}>
              Maybe later
            </Button>
            <Button variant="hero" onClick={submit} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
