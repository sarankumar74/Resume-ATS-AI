// Analyze a resume with Lovable AI and persist the result.
// Called from the SPA via supabase.functions.invoke('analyze-resume', { body: ... }).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the given RESUME against the JOB DESCRIPTION (if provided) and produce a strict JSON object with these exact keys:
{
  "ats_score": number 0-100,
  "jd_match_score": number 0-100,
  "grammar_score": number 0-100,
  "formatting_score": number 0-100,
  "summary": string (2-3 sentences),
  "strengths": string[] (5-8 items),
  "weaknesses": string[] (5-8 items),
  "missing_keywords": string[],
  "missing_skills": string[],
  "grammar_issues": string[],
  "star_suggestions": string[],
  "action_verb_suggestions": string[],
  "formatting_suggestions": string[],
  "improvement_roadmap": string[] (5-7 prioritized actions)
}
If no JD is provided, set jd_match_score to 0 and leave jd-related arrays empty.
Return ONLY valid JSON, no markdown fences.`;

const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const resumeText: string = body?.resumeText ?? "";
    const jdText: string = body?.jdText ?? "";
    const title: string | undefined = body?.title;

    if (typeof resumeText !== "string" || resumeText.length < 50 || resumeText.length > 50000) {
      return new Response(JSON.stringify({ error: "resumeText must be 50-50000 chars" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (jdText.length > 20000) {
      return new Response(JSON.stringify({ error: "jdText too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `RESUME:\n${resumeText}\n\n---\nJOB DESCRIPTION:\n${jdText || "(none provided)"}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      let msg = `AI request failed (${aiRes.status})`;
      if (aiRes.status === 429) msg = "AI rate limit hit. Please try again shortly.";
      else if (aiRes.status === 402) msg = "AI credits exhausted. Please add credits.";
      else msg = `${msg}: ${text}`;
      return new Response(JSON.stringify({ error: msg }), {
        status: aiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await aiRes.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";
    let feedback: Record<string, unknown>;
    try {
      feedback = JSON.parse(content);
    } catch {
      return new Response(JSON.stringify({ error: "AI returned malformed JSON" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: row, error } = await supabase
      .from("resume_scans")
      .insert({
        user_id: userId,
        title: title || `Scan ${new Date().toLocaleString()}`,
        resume_text: resumeText,
        jd_text: jdText || null,
        ats_score: clamp(feedback.ats_score),
        jd_match_score: clamp(feedback.jd_match_score),
        grammar_score: clamp(feedback.grammar_score),
        formatting_score: clamp(feedback.formatting_score),
        feedback,
        status: "completed",
      })
      .select("id")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id: row.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("analyze-resume error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
