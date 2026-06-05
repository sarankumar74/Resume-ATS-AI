import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

type Testimonial = {
  id: string;
  display_name: string;
  rating: number;
  message: string;
  avatar_url: string | null;
  created_at: string;
};

export function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ["public_testimonials"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("testimonials")
        .select("id, display_name, rating, message, avatar_url, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(9);
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Loved by job seekers</h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Real reviews from users who scanned with ResumeIQ.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < t.rating ? "fill-warning text-warning" : "text-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground/90">"{t.message}"</p>
            <div className="mt-4 flex items-center gap-3">
              {t.avatar_url ? (
                <img src={t.avatar_url} alt={t.display_name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {t.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{t.display_name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
