import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SIGNED_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

export function AvatarUploader({ size = 96, onChange }: { size?: number; onChange?: (url: string | null) => void }) {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle();
      if (data?.avatar_url) setUrl(data.avatar_url);
    })();
  }, [user]);

  const upload = async (file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB image");
    if (!file.type.startsWith("image/")) return toast.error("Image files only");
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage.from("avatars").createSignedUrl(path, SIGNED_TTL);
      if (signErr) throw signErr;
      const newUrl = signed.signedUrl;
      const { error: profErr } = await supabase.from("profiles").update({ avatar_url: newUrl }).eq("id", user.id);
      if (profErr) throw profErr;
      setUrl(newUrl);
      onChange?.(newUrl);
      toast.success("Profile picture updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
      setUrl(null);
      onChange?.(null);
    } finally {
      setBusy(false);
    }
  };

  const initial = (user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
        style={{ height: size, width: size }}
      >
        {url ? (
          <img src={url} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-2xl font-bold">{initial}</div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-background/60">
            <Loader2 className="h-5 w-5 animate-spin text-primary-glow" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <Button variant="hero" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Camera className="h-4 w-4" /> {url ? "Change photo" : "Upload photo"}
        </Button>
        {url && (
          <Button variant="glass" size="sm" disabled={busy} onClick={remove}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}
