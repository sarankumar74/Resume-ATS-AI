import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy, CalendarDays } from "lucide-react";

type Streak = {
  current_streak: number;
  longest_streak: number;
  total_days: number;
  last_activity_date: string | null;
};

export function StreakCard() {
  const { data } = useQuery({
    queryKey: ["user_streak"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("user_streaks")
        .select("current_streak, longest_streak, total_days, last_activity_date")
        .maybeSingle();
      if (error) throw error;
      return (data ?? {
        current_streak: 0,
        longest_streak: 0,
        total_days: 0,
        last_activity_date: null,
      }) as Streak;
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  const active = data?.last_activity_date === today;

  // Build last 28 days contribution grid based on streak proxy: we only know last_activity_date,
  // so render active = today/yesterday cells. For richer history we use simple recent dots.
  const cells: { date: string; active: boolean }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const s = d.toISOString().slice(0, 10);
    cells.push({ date: s, active: !!data?.last_activity_date && s === data.last_activity_date });
  }

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Your streak</div>
            <div className="font-display text-2xl font-bold">
              {data?.current_streak ?? 0} <span className="text-sm font-normal text-muted-foreground">day{(data?.current_streak ?? 0) === 1 ? "" : "s"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="h-4 w-4 text-warning" /> Best {data?.longest_streak ?? 0}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary-glow" /> {data?.total_days ?? 0} active
          </div>
        </div>
      </div>

      <div
        className="mt-5 grid gap-1"
        style={{ gridTemplateColumns: "repeat(28, minmax(0, 1fr))" }}
      >
        {cells.map((c) => (
          <div
            key={c.date}
            title={c.date}
            className={`aspect-square rounded-[3px] ${
              c.active ? "bg-gradient-primary shadow-glow" : "bg-accent/15"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {active
          ? "You've scanned today — streak active. Keep it going!"
          : "Run a scan today to keep your streak alive."}
      </p>
    </div>
  );
}
