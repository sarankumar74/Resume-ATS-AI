import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function History() {
  const { data: scans, isLoading } = useQuery({
    queryKey: ["scans", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_scans")
        .select("id, title, ats_score, jd_match_score, grammar_score, formatting_score, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <SEO title="History — ResumeIQ" canonical="/history" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Resume history</h1>
          <p className="text-sm text-muted-foreground">All your past scans and their scores.</p>
        </div>
        <Link to="/upload"><Button variant="hero"><Upload className="h-4 w-4" /> New scan</Button></Link>
      </div>

      <div className="glass rounded-2xl p-2">
        {isLoading ? (
          <div className="p-10 text-center text-muted-foreground">Loading…</div>
        ) : !scans || scans.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No scans yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {scans.map((s) => (
              <Link key={s.id} to={`/report/${s.id}`} className="grid grid-cols-2 gap-4 p-4 hover:bg-accent/10 md:grid-cols-6">
                <div className="col-span-2 md:col-span-2">
                  <div className="font-medium truncate">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                <ScoreCell label="ATS" value={s.ats_score} />
                <ScoreCell label="JD" value={s.jd_match_score} />
                <ScoreCell label="Grammar" value={s.grammar_score} />
                <ScoreCell label="Format" value={s.formatting_score} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-bold">{value ?? "—"}</div>
    </div>
  );
}
