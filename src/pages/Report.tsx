import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Sparkles, Target, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import jsPDF from "jspdf";

type Feedback = {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  missing_keywords?: string[];
  missing_skills?: string[];
  grammar_issues?: string[];
  star_suggestions?: string[];
  action_verb_suggestions?: string[];
  formatting_suggestions?: string[];
  improvement_roadmap?: string[];
};

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const { data: scan, isLoading } = useQuery({
    queryKey: ["scan", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_scans")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Loading report…</div>;
  if (!scan) return <div className="glass rounded-2xl p-10 text-center">Report not found.</div>;

  const fb = (scan.feedback ?? {}) as Feedback;

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;
    const line = (text: string, size = 11, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageW - margin * 2);
      for (const l of lines) {
        if (y > pageH - margin) { doc.addPage(); y = margin; }
        doc.text(l, margin, y);
        y += size + 4;
      }
    };
    const heading = (t: string) => { y += 6; line(t, 14, true); y += 2; };
    const list = (title: string, items?: string[], numbered = false) => {
      if (!items || items.length === 0) return;
      heading(title);
      items.forEach((it, i) => line(`${numbered ? `${i + 1}.` : "•"} ${it}`));
    };

    line(scan.title, 18, true);
    line(new Date(scan.created_at).toLocaleString(), 10);
    y += 6;
    heading("Scores");
    line(`ATS Score: ${scan.ats_score ?? 0}/100`);
    line(`JD Match: ${scan.jd_match_score ?? 0}/100`);
    line(`Grammar: ${scan.grammar_score ?? 0}/100`);
    line(`Formatting: ${scan.formatting_score ?? 0}/100`);
    if (fb.summary) { heading("Summary"); line(fb.summary); }
    list("Strengths", fb.strengths);
    list("Weaknesses", fb.weaknesses);
    list("Missing keywords", fb.missing_keywords);
    list("Missing skills", fb.missing_skills);
    list("Grammar fixes", fb.grammar_issues);
    list("STAR format suggestions", fb.star_suggestions);
    list("Stronger action verbs", fb.action_verb_suggestions);
    list("Formatting suggestions", fb.formatting_suggestions);
    list("Improvement roadmap", fb.improvement_roadmap, true);

    const safe = (scan.title || "resume-report").replace(/[^a-z0-9-_]+/gi, "_");
    doc.save(`${safe}.pdf`);
  };

  return (
    <div className="space-y-6">
      <SEO title={`${scan.title} — ResumeIQ Report`} canonical={`/report/${id}`} />
      <Link to="/history" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to history
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{scan.title}</h1>
          <p className="text-sm text-muted-foreground">{new Date(scan.created_at).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="glass" onClick={downloadPdf}><Download className="h-4 w-4" /> Download PDF</Button>
          <Link to="/upload"><Button variant="hero"><Sparkles className="h-4 w-4" /> New scan</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <BigScore label="ATS Score" value={scan.ats_score ?? 0} />
        <BigScore label="JD Match" value={scan.jd_match_score ?? 0} />
        <BigScore label="Grammar" value={scan.grammar_score ?? 0} />
        <BigScore label="Formatting" value={scan.formatting_score ?? 0} />
      </div>

      {fb.summary && (
        <Section title="Summary" icon={Target}>
          <p className="text-sm text-muted-foreground">{fb.summary}</p>
        </Section>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <ListSection title="Strengths" tone="success" items={fb.strengths} />
        <ListSection title="Weaknesses" tone="warning" items={fb.weaknesses} />
        <ListSection title="Missing keywords" tone="primary" items={fb.missing_keywords} chips />
        <ListSection title="Missing skills" tone="primary" items={fb.missing_skills} chips />
        <ListSection title="Grammar fixes" tone="warning" items={fb.grammar_issues} />
        <ListSection title="STAR format suggestions" tone="primary" items={fb.star_suggestions} />
        <ListSection title="Stronger action verbs" tone="primary" items={fb.action_verb_suggestions} chips />
        <ListSection title="Formatting suggestions" tone="primary" items={fb.formatting_suggestions} />
      </div>

      <ListSection title="Your improvement roadmap" tone="success" items={fb.improvement_roadmap} numbered />
    </div>
  );
}

function BigScore({ label, value }: { label: string; value: number }) {
  const tone = value >= 80 ? "text-success" : value >= 60 ? "text-primary-glow" : "text-warning";
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-5xl font-bold ${tone}`}>{value}<span className="text-xl text-muted-foreground">/100</span></div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Target; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
        <Icon className="h-4 w-4 text-primary-glow" /> {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ListSection({ title, tone, items, chips, numbered }: { title: string; tone: "success" | "warning" | "primary"; items?: string[]; chips?: boolean; numbered?: boolean }) {
  if (!items || items.length === 0) return null;
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  const iconColor = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary-glow";

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
        <Icon className={`h-4 w-4 ${iconColor}`} /> {title}
      </h3>
      {chips ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span key={i} className="rounded-full border border-border bg-card/40 px-3 py-1 text-xs">{t}</span>
          ))}
        </div>
      ) : (
        <ul className={`mt-3 space-y-2 text-sm text-muted-foreground ${numbered ? "list-decimal pl-5" : ""}`}>
          {items.map((t, i) => (
            <li key={i} className={numbered ? "" : "flex gap-2"}>
              {!numbered && <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${iconColor.replace("text-", "bg-")}`} />}
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
