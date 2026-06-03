import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ScanLine,
  Sparkles,
  Target,
  CheckCircle2,
  FileText,
  Wand2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { SEO } from "@/components/SEO";

const SITE_TITLE = "ResumeIQ — Beat the ATS, land more interviews";
const SITE_DESC =
  "Upload your resume and job description to instantly get an ATS score, JD match analysis, missing skills, STAR rewrites, and an AI improvement roadmap.";

export default function Index() {
  const [params] = useSearchParams();
  const ref = params.get("ref");

  useEffect(() => {
    if (ref) {
      try {
        localStorage.setItem("resumeiq_ref", ref);
      } catch {
        /* ignore */
      }
    }
  }, [ref]);

  return (
    <div className="min-h-screen bg-hero">
      <SEO
        title={SITE_TITLE}
        description={SITE_DESC}
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ResumeIQ",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: SITE_DESC,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary shadow-glow sm:h-9 sm:w-9">
            <ScanLine className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
            Resume<span className="text-gradient">IQ</span>
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to="/login"><Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button></Link>
          <Link to="/signup"><Button variant="hero" size="sm">Get started</Button></Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-24 sm:pt-16">
        <div className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur sm:px-4 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
          <span className="truncate">AI ATS scoring · JD match · Smart feedback</span>
        </div>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
          Beat the ATS.
          <br />
          <span className="text-gradient">Land more interviews.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
          Drop in your resume and a job description. Our AI agents score your
          ATS compatibility, surface missing skills, fix grammar, and rewrite
          weak bullets in STAR format — in seconds.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center">
          <Link to="/signup">
            <Button variant="hero" size="lg" className="h-12 w-full px-7 text-base sm:w-auto">
              Analyze my resume — free
              <Zap className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="glass" size="lg" className="h-12 w-full px-7 text-base sm:w-auto">
              I already have an account
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-20">
          <div className="glass rounded-2xl p-2 shadow-elegant sm:rounded-3xl">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-background/40 p-4 sm:gap-4 sm:rounded-2xl sm:p-8 lg:grid-cols-4">
              <ScoreTile label="ATS Score" value={92} tone="success" />
              <ScoreTile label="JD Match" value={84} tone="primary" />
              <ScoreTile label="Grammar" value={97} tone="success" />
              <ScoreTile label="Formatting" value={88} tone="primary" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">A complete AI career toolkit</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">Two AI agents. One unified improvement roadmap.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={FileText} title="Resume Structure Analyzer" desc="Validates formatting, grammar, contact info, section order, and icon overuse." />
          <FeatureCard icon={Target} title="ATS + JD Matching" desc="Scores ATS compatibility, surfaces missing keywords, tech stack & skills." />
          <FeatureCard icon={Wand2} title="STAR Rewrites" desc="Transforms weak bullets into measurable, action-verb-driven achievements." />
          <FeatureCard icon={ShieldCheck} title="Privacy first" desc="Your data is encrypted and only you can view your scans." />
          <FeatureCard icon={CheckCircle2} title="Improvement Roadmap" desc="Prioritized, actionable suggestions you can ship today." />
          <FeatureCard icon={Sparkles} title="Score history" desc="Track every iteration — watch your score climb." />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Three steps to a stronger resume</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { n: "01", t: "Paste resume & JD", d: "Drop in your resume text and the job description you're targeting." },
            { n: "02", t: "AI runs the analysis", d: "Two agents review structure, grammar, ATS-friendliness, and JD alignment." },
            { n: "03", t: "Get your roadmap", d: "Receive scores, missing skills, STAR rewrites, and clear next actions." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6 sm:p-7">
              <div className="text-sm font-mono text-primary-glow">{s.n}</div>
              <div className="mt-2 text-lg font-semibold sm:text-xl">{s.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="glass rounded-2xl p-8 text-center shadow-glow sm:rounded-3xl sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Ready to get shortlisted?</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">Free to start. No credit card.</p>
          <Link to="/signup">
            <Button variant="hero" size="lg" className="mt-6 h-12 px-8 text-base sm:mt-8">
              Run my first scan
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 px-4 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ResumeIQ. Built with AI.
      </footer>
    </div>
  );
}

function ScoreTile({ label, value, tone }: { label: string; value: number; tone: "success" | "primary" }) {
  const color = tone === "success" ? "text-success" : "text-primary-glow";
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5 text-left">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-4xl font-bold ${color}`}>{value}</div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: typeof FileText; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-7 transition-transform hover:-translate-y-1">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <div className="mt-1.5 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}
