import { useEffect, useState } from "react";
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
  ChevronRight,
  BarChart,
  LayoutDashboard,
  Flame,
  Users,
  MessageSquare,
  Award,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  FileWarning,
  Clock,
  History,
  Gift,
  Star,
  Check
} from "lucide-react";
import { SEO } from "@/components/SEO";

const SITE_TITLE = "ResumeIQ — Beat the ATS, land more interviews";
const SITE_DESC = "Upload your resume and job description to instantly get an ATS score, JD match analysis, missing skills, STAR rewrites, and an AI improvement roadmap.";

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SEO title={SITE_TITLE} description={SITE_DESC} canonical="/" />
      
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary shadow-glow sm:h-9 sm:w-9">
              <ScanLine className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Resume<span className="text-gradient">IQ</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login"><Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:text-primary">Sign in</Button></Link>
            <Link to="/signup"><Button variant="hero" size="sm" className="shadow-glow">Get started</Button></Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <HeroSection />
        <WhyFailSection />
        <CoreFeaturesSection />
        <HowItWorksSection />
        <DashboardShowcaseSection />
        <StreakSystemSection />
        <ResumeHistorySection />
        <InviteFriendsSection />
        <TestimonialsSection />
        <StatisticsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}

// --- SECTION 1: HERO ---
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:flex lg:items-center lg:gap-16">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> The #1 ATS Resume Analyzer
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Beat ATS Systems.<br />
            <span className="text-gradient">Get More Interviews.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Upload your resume, compare it against any job description, discover missing keywords, improve your ATS score, and get AI-powered recommendations in seconds.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="h-14 w-full px-8 text-lg shadow-glow sm:w-auto">
                Start Free Scan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="h-14 w-full px-8 text-lg sm:w-auto border-primary/50 hover:bg-primary/10">
                View Demo
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 50,000+ Resumes Analyzed</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 95% ATS Accuracy</div>
          </div>
        </div>
        
        {/* Mockup Right Side */}
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-grow">
          <div className="rounded-3xl p-6 border border-primary/20 bg-[#0A0E0D] transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div className="font-display font-semibold flex items-center gap-2 text-foreground">
                <Target className="text-primary h-5 w-5" /> ATS Match Report
              </div>
              <div className="text-xs text-muted-foreground">Just now</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="rounded-xl bg-[#111614] p-4 border border-border/50">
                <div className="text-xs text-muted-foreground">ATS Score</div>
                <div className="text-5xl font-bold text-primary mt-2">94%</div>
                <div className="h-2 w-full bg-muted/30 rounded-full mt-4"><div className="h-full bg-primary rounded-full w-[94%]" /></div>
              </div>
              <div className="rounded-xl bg-[#111614] p-4 border border-border/50">
                <div className="text-xs text-muted-foreground">Resume Match</div>
                <div className="text-5xl font-bold text-primary mt-2">88%</div>
                <div className="h-2 w-full bg-muted/30 rounded-full mt-4"><div className="h-full bg-primary rounded-full w-[88%]" /></div>
              </div>
            </div>
            
            <div className="mt-4 rounded-xl bg-[#111614] p-5 border border-border/50">
              <div className="text-sm font-semibold mb-3 text-foreground">Missing Keywords</div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1.5 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium">Kubernetes</span>
                <span className="px-3 py-1.5 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium">GraphQL</span>
                <span className="px-3 py-1.5 text-xs rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium">CI/CD Pipeline</span>
              </div>
            </div>
            
            <div className="mt-4 rounded-xl bg-[#111614] p-5 border border-border/50">
              <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground"><Wand2 className="h-4 w-4 text-primary" /> AI Suggestions</div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">Consider rewriting bullet point 3 using the STAR method to highlight measurable outcomes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- SECTION 2: WHY FAIL ---
function WhyFailSection() {
  return (
    <section className="py-20 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Most Resumes Never Reach Recruiters</h2>
        <p className="mt-4 text-muted-foreground">Don't let algorithms decide your fate.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <WhyCard icon={ShieldCheck} title="ATS Rejection" desc="Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them." />
          <WhyCard icon={Target} title="Missing Keywords" desc="Failing to match the exact terminology used in the job description drops your ranking." />
          <WhyCard icon={FileWarning} title="Poor Formatting" desc="Complex layouts, tables, and weird fonts confuse parsers, resulting in scrambled text." />
          <WhyCard icon={TrendingUp} title="Low Job Match Score" desc="Generic resumes score poorly. Tailoring is required for every application." />
        </div>
      </div>
    </section>
  );
}

function WhyCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass rounded-2xl p-6 text-left border-border/50 hover:border-primary/50 transition-colors">
      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

// --- SECTION 3: CORE FEATURES ---
function CoreFeaturesSection() {
  const features = [
    { icon: BarChart, title: "ATS Score Analysis", desc: "Get an instant score on how well your resume parses in standard ATS software." },
    { icon: Target, title: "Job Description Matching", desc: "Compare your resume directly against any JD to see your true compatibility." },
    { icon: ScanLine, title: "Missing Keyword Detection", desc: "Identify the exact hard and soft skills you need to add to pass the filter." },
    { icon: Wand2, title: "Resume Rewrite Assistant", desc: "Our AI rewrites your weak bullet points into strong, action-oriented accomplishments." },
    { icon: Sparkles, title: "AI Career Coach", desc: "Get personalized advice on how to position your experience for your target role." },
    { icon: FileText, title: "Resume Builder", desc: "Create a perfectly formatted, ATS-friendly resume from scratch with our builder." },
    { icon: History, title: "Resume History", desc: "Keep track of every version and see how your score improves over time." },
    { icon: TrendingUp, title: "Performance Tracking", desc: "Monitor your application success and optimize your strategy with data." }
  ];

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything You Need To Beat ATS Systems</h2>
          <p className="mt-4 text-muted-foreground">A complete suite of tools designed to get you past the robots and into the interview room.</p>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-glow group">
              <f.icon className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" />
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SECTION 4: HOW IT WORKS ---
function HowItWorksSection() {
  const steps = [
    { n: "1", t: "Upload Resume", d: "PDF or DOCX format." },
    { n: "2", t: "Paste Job Description", d: "Optional but highly recommended." },
    { n: "3", t: "Run Analysis", d: "AI scans your resume in seconds." },
    { n: "4", t: "Get ATS Report", d: "View scores and detailed recommendations." },
    { n: "5", t: "Optimize Resume", d: "Improve weak sections instantly with AI." }
  ];

  return (
    <section id="how" className="py-20 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Get ATS Ready In Minutes</h2>
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>
          {steps.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 w-full max-w-xs flex-1 relative bg-card/80 border-primary/20">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-xl shadow-glow mb-4">
                {s.n}
              </div>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SECTION 5: DASHBOARD SHOWCASE ---
function DashboardShowcaseSection() {
  return (
    <section id="dashboard" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Track Your Resume Progress</h2>
          <p className="mt-4 text-muted-foreground">Your personal AI career command center.</p>
        </div>
        <div className="glass rounded-3xl p-2 sm:p-6 shadow-glow border-primary/30 mx-auto max-w-5xl bg-card/40">
           {/* Stylized Dashboard UI representation */}
           <div className="rounded-2xl border border-border bg-background p-6">
             <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                <div className="text-xl font-display font-bold">Welcome back, User 👋</div>
                <Button variant="hero" size="sm">New Scan</Button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="border border-border rounded-xl p-4 bg-card/50">
                 <div className="text-xs text-muted-foreground uppercase">Current ATS Score</div>
                 <div className="text-3xl font-bold text-primary mt-1">92</div>
               </div>
               <div className="border border-border rounded-xl p-4 bg-card/50">
                 <div className="text-xs text-muted-foreground uppercase">Keyword Matches</div>
                 <div className="text-3xl font-bold text-success mt-1">45/50</div>
               </div>
               <div className="border border-border rounded-xl p-4 bg-card/50">
                 <div className="text-xs text-muted-foreground uppercase">Total Scans</div>
                 <div className="text-3xl font-bold text-foreground mt-1">12</div>
               </div>
               <div className="border border-border rounded-xl p-4 bg-card/50">
                 <div className="text-xs text-muted-foreground uppercase">Active Streak</div>
                 <div className="text-3xl font-bold text-primary mt-1 flex items-center gap-1">5 <Flame className="h-5 w-5"/></div>
               </div>
             </div>
             <div className="space-y-4">
               <div className="text-sm font-semibold">Recent Scans</div>
               {[1,2,3].map(i => (
                 <div key={i} className="flex justify-between items-center p-4 border border-border rounded-xl hover:bg-accent/10 transition-colors cursor-pointer">
                    <div>
                      <div className="font-medium">Frontend Developer - Google</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                    <div className="text-primary font-bold">95% ATS</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

// --- SECTION 6: STREAK SYSTEM ---
function StreakSystemSection() {
  return (
    <section className="py-20 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:flex lg:items-center lg:gap-16">
        <div className="lg:w-1/2">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Build Consistency.<br/>Improve Every Day.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Small improvements daily lead to dramatically better interview outcomes. Keep your streak alive by analyzing and tweaking your resume.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 border-primary/20">
              <div className="text-primary font-bold text-2xl flex items-center gap-2"><Flame/> 7 Day</div>
              <div className="text-sm text-muted-foreground mt-1">Current Streak</div>
            </div>
            <div className="glass rounded-xl p-4 border-primary/20">
              <div className="text-foreground font-bold text-2xl flex items-center gap-2"><Award className="text-warning"/> 30 Day</div>
              <div className="text-sm text-muted-foreground mt-1">Longest Streak</div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0 glass p-6 rounded-3xl">
          <div className="text-sm font-semibold mb-4">90 Day Activity Timeline</div>
          <div className="grid grid-cols-12 gap-1 sm:gap-2">
            {Array.from({length: 60}).map((_, i) => (
              <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.3 ? 'bg-primary/80 shadow-[0_0_8px_rgba(0,255,102,0.4)]' : 'bg-muted/30'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- SECTION 7: RESUME HISTORY ---
function ResumeHistorySection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Never Lose Your Progress</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Access every version of your resume you've ever analyzed. Compare scores, download past reports, and track your improvements over time.</p>
        <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass p-6 rounded-2xl"><History className="mx-auto h-8 w-8 text-primary mb-3"/> View Previous Reports</div>
          <div className="glass p-6 rounded-2xl"><TrendingUp className="mx-auto h-8 w-8 text-primary mb-3"/> Compare ATS Scores</div>
          <div className="glass p-6 rounded-2xl"><FileText className="mx-auto h-8 w-8 text-primary mb-3"/> Manage Resume Versions</div>
        </div>
      </div>
    </section>
  );
}

// --- SECTION 8: INVITE FRIENDS ---
function InviteFriendsSection() {
  return (
    <section className="py-20 bg-primary/5 border-y border-primary/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Gift className="h-12 w-12 mx-auto text-primary mb-6 animate-pulse" />
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Grow Together</h2>
        <p className="mt-4 text-lg text-muted-foreground">Share your referral link with friends. When they sign up, you both earn free premium scans and unlock advanced features.</p>
        <Button variant="hero" size="lg" className="mt-8 shadow-glow">Get Your Invite Link</Button>
      </div>
    </section>
  );
}

// --- SECTION 9: TESTIMONIALS ---
function TestimonialsSection() {
  const reviews = [
    { name: "Sarah J.", role: "Software Engineer", text: "ResumeIQ caught missing React keywords that I completely overlooked. Got an interview at a FAANG company the next week!" },
    { name: "Michael T.", role: "Marketing Director", text: "The STAR rewrite assistant is magic. It turned my boring job duties into powerful achievement statements." },
    { name: "Jessica R.", role: "Product Manager", text: "My ATS score went from 45% to 92% in 15 minutes. Highly recommend to anyone struggling to get past the initial screen." }
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl text-center">Loved By Job Seekers</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-8 relative">
              <div className="flex gap-1 mb-4 text-warning">
                <Star className="fill-current h-4 w-4"/><Star className="fill-current h-4 w-4"/><Star className="fill-current h-4 w-4"/><Star className="fill-current h-4 w-4"/><Star className="fill-current h-4 w-4"/>
              </div>
              <p className="text-muted-foreground">"{r.text}"</p>
              <div className="mt-6 font-semibold">{r.name}</div>
              <div className="text-xs text-primary">{r.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SECTION 10: STATISTICS ---
function StatisticsSection() {
  return (
    <section className="py-16 bg-background/50 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-center mb-10 text-muted-foreground">Trusted By Thousands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-display font-bold text-primary">50K+</div><div className="mt-2 text-sm text-muted-foreground">Resumes Analyzed</div></div>
          <div><div className="text-4xl font-display font-bold text-primary">95%</div><div className="mt-2 text-sm text-muted-foreground">Avg ATS Accuracy</div></div>
          <div><div className="text-4xl font-display font-bold text-primary">20K+</div><div className="mt-2 text-sm text-muted-foreground">Job Matches</div></div>
          <div><div className="text-4xl font-display font-bold text-primary">100+</div><div className="mt-2 text-sm text-muted-foreground">Industries Supported</div></div>
        </div>
      </div>
    </section>
  );
}

// --- SECTION 11: FAQ ---
function FAQSection() {
  const faqs = [
    { q: "What is ATS?", a: "ATS (Applicant Tracking System) is software used by employers to filter and rank resumes based on keywords before a human reads them." },
    { q: "How accurate is the analysis?", a: "Our AI models are trained on the exact parsing logic used by top ATS platforms like Workday, Greenhouse, and Lever, providing ~95% accuracy." },
    { q: "Can I upload PDF resumes?", a: "Yes! We support both PDF and DOCX formats." },
    { q: "Does it support job descriptions?", a: "Absolutely. Pasting a job description alongside your resume unlocks powerful JD match scoring and specific keyword targeting." },
    { q: "How many scans are free?", a: "You get 3 free scans when you sign up to try the platform." },
    { q: "Is my resume secure?", a: "Your data is completely private, encrypted at rest, and never shared with third-party employers." }
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <h3 className="font-semibold text-lg flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary"/> {f.q}</h3>
              <p className="mt-2 text-muted-foreground pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SECTION 12: FINAL CTA ---
function FinalCTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-12 text-center shadow-glow border-primary/40 bg-card/80">
          <h2 className="text-4xl font-bold sm:text-5xl">Start Improving Your Resume Today</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Upload your resume and discover exactly why recruiters aren't seeing it.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload"><Button variant="hero" size="lg" className="h-14 w-full sm:w-auto px-8 text-lg shadow-glow">Start Free ATS Scan</Button></Link>
            <Link to="/signup"><Button variant="outline" size="lg" className="h-14 w-full sm:w-auto px-8 text-lg">Create Free Account</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- FOOTER ---
function Footer() {
  return (
    <footer className="border-t border-border bg-card/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-primary" />
          <span className="font-display font-bold">ResumeIQ</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary">Features</a>
          <a href="#" className="hover:text-primary">Pricing</a>
          <a href="#" className="hover:text-primary">Dashboard</a>
          <a href="#" className="hover:text-primary">Resume Builder</a>
          <a href="#" className="hover:text-primary">Contact</a>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms</a>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ATS Resume Analyzer. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
