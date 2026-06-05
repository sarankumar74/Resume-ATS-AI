-- STREAKS
CREATE TABLE public.user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date,
  total_days integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_streaks TO authenticated;
GRANT ALL ON public.user_streaks TO service_role;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own streak" ON public.user_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own streak" ON public.user_streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own streak" ON public.user_streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Trigger function to update streak on new scan
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.user_streaks%ROWTYPE;
  today date := (NEW.created_at AT TIME ZONE 'UTC')::date;
  diff integer;
BEGIN
  SELECT * INTO rec FROM public.user_streaks WHERE user_id = NEW.user_id;
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_days)
    VALUES (NEW.user_id, 1, 1, today, 1);
    RETURN NEW;
  END IF;

  IF rec.last_activity_date = today THEN
    -- already counted today
    RETURN NEW;
  END IF;

  diff := today - rec.last_activity_date;
  IF diff = 1 THEN
    rec.current_streak := rec.current_streak + 1;
  ELSE
    rec.current_streak := 1;
  END IF;

  UPDATE public.user_streaks
  SET current_streak = rec.current_streak,
      longest_streak = GREATEST(rec.longest_streak, rec.current_streak),
      last_activity_date = today,
      total_days = rec.total_days + 1,
      updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_resume_scans_streak
AFTER INSERT ON public.resume_scans
FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_id uuid REFERENCES public.resume_scans(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  rating integer NOT NULL,
  message text NOT NULL,
  avatar_url text,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonials TO authenticated;
GRANT SELECT ON public.testimonials TO anon;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.validate_testimonial()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF length(NEW.message) < 5 OR length(NEW.message) > 1000 THEN
    RAISE EXCEPTION 'message length must be 5-1000 chars';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_testimonial BEFORE INSERT OR UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.validate_testimonial();

CREATE POLICY "anyone view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "users view own testimonials" ON public.testimonials FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);