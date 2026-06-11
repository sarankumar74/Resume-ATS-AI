import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, Briefcase } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const jdRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if ((location.state as { focus?: string } | null)?.focus === "jd") {
      jdRef.current?.focus();
    }
  }, [location.state]);

  const extractPdf = async (file: File): Promise<string> => {
    const pdfjs: any = await import("pdfjs-dist");
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(" ") + "\n";
    }
    return text.trim();
  };

  const extractDocx = async (file: File): Promise<string> => {
    const mammoth: any = await import("mammoth/mammoth.browser");
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return (res.value as string).trim();
  };

  const handleFile = async (file: File) => {
    try {
      const name = file.name.toLowerCase();
      let text = "";
      if (name.endsWith(".pdf") || file.type === "application/pdf") {
        toast.info("Extracting PDF…");
        text = await extractPdf(file);
      } else if (name.endsWith(".docx") || file.type.includes("officedocument.wordprocessingml")) {
        toast.info("Extracting Word document…");
        text = await extractDocx(file);
      } else if (name.endsWith(".doc")) {
        return toast.error("Legacy .doc not supported. Please save as .docx or PDF.");
      } else {
        text = await file.text();
      }
      if (!text || text.length < 30) return toast.error("Couldn't extract enough text from the file.");
      setResumeText(text);
      toast.success(`Resume loaded (${text.length} chars)`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to read file. Try pasting the text instead.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim().length < 50) return toast.error("Please paste a more complete resume (50+ chars)");
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText, jdText, title: title || undefined },
      });
      if (error) throw new Error(error.message);
      if (!data?.id) throw new Error("Analysis failed");
      toast.success("Analysis complete!");
      navigate(`/report/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SEO title="New scan — ResumeIQ" canonical="/upload" />
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">New resume scan</h1>
        <p className="text-sm text-muted-foreground">Paste your resume and (optionally) a job description. Our AI does the rest.</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Scan title (optional)</Label>
          <Input id="title" className="h-12 text-base" placeholder="e.g. Frontend Engineer at Acme" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div
          className="rounded-xl border-2 border-dashed border-border p-4 text-center hover:border-primary/50 hover:bg-muted/20 transition-colors sm:p-6 cursor-pointer"
          onClick={() => document.getElementById('resume-upload')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
        >
          <FileText className="mx-auto h-7 w-7 text-primary-glow sm:h-8 sm:w-8 pointer-events-none" />
          <p className="mt-2 text-xs sm:text-sm pointer-events-none">Drop a PDF, DOCX, or TXT resume here</p>

          <input
            id="resume-upload"
            type="file"
            accept=".txt,.md,text/plain,.pdf,.docx"
            className="mt-3 mx-auto block max-w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-gradient-primary file:px-3 file:py-1.5 file:text-primary-foreground file:cursor-pointer"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Resume text</Label>
          <Textarea
            id="resume"
            rows={8}
            placeholder="Paste your resume here…"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="font-mono text-xs sm:min-h-[18rem]"
            required
          />
          <p className="text-xs text-muted-foreground">{resumeText.length} chars</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jd" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Job description (optional but recommended)</Label>
          <Textarea
            id="jd"
            ref={jdRef}
            rows={6}
            placeholder="Paste the job description for JD matching…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="font-mono text-xs sm:min-h-[12rem]"
          />
        </div>
      </div>

      <Button type="submit" variant="hero" size="lg" disabled={busy} className="w-full h-12 text-base">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with AI…</> : <><Sparkles className="h-4 w-4" /> Run AI analysis</>}
      </Button>
    </form>
  );
}
