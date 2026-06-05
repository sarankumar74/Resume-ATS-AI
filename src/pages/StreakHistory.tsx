import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/SEO";
import { Flame, CalendarDays, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ScanRow = { id: string; created_at: string; title: string; ats_score: number | null };

export default function StreakHistory() {
  const { user } = useAuth();

  const { data: scans = [], isLoading } = useQuery({
    queryKey: ["streak_history_scans", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_scans")
        .select("id, created_at, title, ats_score")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ScanRow[];
    },
  });

  const { data: streak } = useQuery({
    queryKey: ["user_streak_full", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak, total_days, last_activity_date")
        .maybeSingle();
      return data;
    },
  });

  // Group scans by UTC date
  const byDay = useMemo(() => {
    const m = new Map<string, ScanRow[]>();
    for (const s of scans) {
      const d = new Date(s.created_at).toISOString().slice(0, 10);
      if (!m.has(d)) m.set(d, []);
      m.get(d)!.push(s);
    }
    return m;
  }, [scans]);

  // Build last 90 days timeline with break detection
  const timeline = useMemo(() => {
    const days: { date: string; scans: ScanRow[]; active: boolean }[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      const rows = byDay.get(key) ?? [];
      days.push({ date: key, scans: rows, active: rows.length > 0 });
    }
    return days;
  }, [byDay]);

  // Compute streak segments (consecutive active days)
  const segments = useMemo(() => {
    const segs: { start: string; end: string; length: number }[] = [];
    let cur: { start: string; end: string; length: number } | null = null;
    // walk oldest -> newest
    const ordered = [...timeline].reverse();
    for (const d of ordered) {
      if (d.active) {
        if (!cur) cur = { start: d.date, end: d.date, length: 1 };
        else {
          cur.end = d.date;
          cur.length += 1;
        }
      } else if (cur) {
        segs.push(cur);
        cur = null;
      }
    }
    if (cur) segs.push(cur);
    return segs.reverse();
  }, [timeline]);

  return (
    <>
      <SEO title="Streak history — ResumeIQ" description="See every day you scanned a resume and where your streaks broke." canonical="/streak" />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Streak history</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every day you uploaded or analyzed a resume.</p>
        </div>
        <Link to="/upload"><Button variant="hero">New scan</Button></Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Flame className="h-4 w-4 text-primary-foreground" />} label="Current" value={streak?.current_streak ?? 0} suffix="days" />
        <Stat icon={<Trophy className="h-4 w-4 text-primary-foreground" />} label="Longest" value={streak?.longest_streak ?? 0} suffix="days" />
        <Stat icon={<CalendarDays className="h-4 w-4 text-primary-foreground" />} label="Total active" value={streak?.total_days ?? 0} suffix="days" />
      </section>

      <section className="glass mt-6 rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Last 90 days</h2>
        <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0,1fr))" }}>
          {[...timeline].reverse().map((d) => (
            <div
              key={d.date}
              title={`${d.date}${d.active ? ` — ${d.scans.length} scan${d.scans.length > 1 ? "s" : ""}` : " — no activity"}`}
              className={`aspect-square rounded-[3px] ${d.active ? "bg-gradient-primary shadow-glow" : "bg-accent/15"}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-accent/15" /> No scan</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gradient-primary shadow-glow" /> Scanned</span>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-bold">Activity timeline</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : timeline.every((d) => !d.active) ? (
          <p className="mt-3 text-sm text-muted-foreground">No activity yet. Run your first scan to start a streak.</p>
        ) : (
          <ol className="mt-4 space-y-2">
            {timeline.map((d) => (
              <li
                key={d.date}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
                  d.active ? "border-primary/30 bg-primary/5" : "border-destructive/20 bg-destructive/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {d.active ? (
                    <CheckCircle2 className="h-5 w-5 text-primary-glow" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive/70" />
                  )}
                  <div>
                    <div className="text-sm font-semibold">
                      {new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {d.active ? `${d.scans.length} scan${d.scans.length > 1 ? "s" : ""}` : "Streak break — no activity"}
                    </div>
                  </div>
                </div>
                {d.active && (
                  <div className="flex flex-wrap gap-2">
                    {d.scans.map((s) => (
                      <Link key={s.id} to={`/report/${s.id}`} className="rounded-md bg-background/60 px-2.5 py-1 text-xs hover:bg-accent/20">
                        {s.title} {typeof s.ats_score === "number" ? `· ${s.ats_score}` : ""}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {segments.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Streak segments</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {segments.map((s) => (
              <li key={s.start + s.end} className="glass rounded-xl p-3 text-sm">
                <div className="font-semibold">{s.length} day{s.length > 1 ? "s" : ""}</div>
                <div className="text-xs text-muted-foreground">{s.start} → {s.end}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Stat({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{suffix}</span>
        </div>
      </div>
    </div>
  );
}
