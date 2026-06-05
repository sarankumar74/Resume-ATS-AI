import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/use-is-admin";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

type Row = {
  id: string;
  display_name: string;
  rating: number;
  message: string;
  avatar_url: string | null;
  approved: boolean;
  created_at: string;
};

export default function AdminTestimonials() {
  const { isAdmin, loading } = useIsAdmin();
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin_testimonials"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, display_name, rating, message, avatar_url, approved, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const setApproved = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast.success(v.approved ? "Approved" : "Unapproved");
      qc.invalidateQueries({ queryKey: ["admin_testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin_testimonials"] });
      qc.invalidateQueries({ queryKey: ["public_testimonials"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  if (loading) return <p className="text-sm text-muted-foreground">Checking access…</p>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const pending = data.filter((r) => !r.approved);
  const approved = data.filter((r) => r.approved);

  return (
    <>
      <SEO title="Admin — Moderate testimonials" description="Approve or reject user testimonials." canonical="/admin/testimonials" />
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldAlert className="h-3.5 w-3.5" /> Admin
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Testimonials moderation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve reviews before they show on the landing page.</p>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <Section title={`Pending (${pending.length})`} items={pending} onApprove={(id) => setApproved.mutate({ id, approved: true })} onUnapprove={(id) => setApproved.mutate({ id, approved: false })} onDelete={(id) => remove.mutate(id)} highlight />
          <Section title={`Approved (${approved.length})`} items={approved} onApprove={(id) => setApproved.mutate({ id, approved: true })} onUnapprove={(id) => setApproved.mutate({ id, approved: false })} onDelete={(id) => remove.mutate(id)} />
        </>
      )}
    </>
  );
}

function Section({
  title,
  items,
  onApprove,
  onUnapprove,
  onDelete,
  highlight,
}: {
  title: string;
  items: Row[];
  onApprove: (id: string) => void;
  onUnapprove: (id: string) => void;
  onDelete: (id: string) => void;
  highlight?: boolean;
}) {
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Nothing here.</p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {items.map((t) => (
            <li key={t.id} className={`glass rounded-2xl p-4 ${highlight ? "ring-1 ring-warning/40" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.display_name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                      {t.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold">{t.display_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                        ))}
                      </span>
                      <span>· {new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {t.approved ? (
                    <Button size="sm" variant="glass" onClick={() => onUnapprove(t.id)}>
                      <X className="mr-1 h-4 w-4" /> Unapprove
                    </Button>
                  ) : (
                    <Button size="sm" variant="hero" onClick={() => onApprove(t.id)}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  )}
                  <Button size="sm" variant="glass" onClick={() => onDelete(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/90">"{t.message}"</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
