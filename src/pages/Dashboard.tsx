import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, TrendingUp, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ReferralCard } from "@/components/referral-card";
import { StreakCard } from "@/components/streak-card";
import { SEO } from "@/components/SEO";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: scans } = useQuery({
    queryKey: ["scans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_scans")
        .select("id, title, ats_score, jd_match_score, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  const list = scans ?? [];
  const avgAts = list.length ? Math.round(list.reduce((s, r) => s + (r.ats_score ?? 0), 0) / list.length) : 0;
  const avgJd = list.length ? Math.round(list.reduce((s, r) => s + (r.jd_match_score ?? 0), 0) / list.length) : 0;
  const best = list.reduce((m, r) => Math.max(m, r.ats_score ?? 0), 0);

  return (
    <div className="space-y-6">
      <SEO title="Dashboard — ResumeIQ" canonical="/dashboard" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold sm:text-3xl truncate">
            Welcome back{(() => {
              const name = (user?.user_metadata?.username as string) || (user?.user_metadata?.full_name as string) || (user?.user_metadata?.name as string) || (user?.email ? user.email.split("@")[0] : "");
              return name ? `, ${name} 👋` : " 👋";
            })()}
          </h1>
          <p className="text-sm text-muted-foreground">Your AI resume command center.</p>
        </div>
        <Link to="/upload" state={{ focus: "jd" }}><Button variant="hero"><Upload className="h-4 w-4" /> New scan</Button></Link>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat icon={FileText} label="Total scans" value={list.length} />
        <Stat icon={Target} label="Avg ATS score" value={avgAts} suffix="/100" />
        <Stat icon={TrendingUp} label="Avg JD match" value={avgJd} suffix="%" />
        <Stat icon={Target} label="Best ATS" value={best} suffix="/100" />
      </div>

      <StreakCard />
      <ReferralCard />

      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent scans</h2>
          <Link to="/history" className="text-sm text-primary-glow hover:underline">View all</Link>
        </div>
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">No scans yet.</p>
            <Link to="/upload" state={{ focus: "jd" }}><Button variant="hero" className="mt-4">Run your first scan</Button></Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {list.slice(0, 6).map((s) => (
              <Link key={s.id} to={`/report/${s.id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-accent/10">
                <div className="min-w-0">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-xs text-muted-foreground">ATS</div>
                    <div className="font-display font-bold text-success">{s.ats_score ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">JD</div>
                    <div className="font-display font-bold text-primary-glow">{s.jd_match_score ?? "—"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, suffix }: { icon: typeof FileText; label: string; value: number; suffix?: string }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs truncate">{label}</span>
        <Icon className="h-4 w-4 shrink-0 text-primary-glow" />
      </div>
      <div className="mt-2 font-display text-2xl font-bold sm:mt-3 sm:text-3xl">
        {value}<span className="text-sm text-muted-foreground sm:text-base">{suffix}</span>
      </div>
    </div>
  );
}
