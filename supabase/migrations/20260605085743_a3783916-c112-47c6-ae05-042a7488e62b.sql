
-- Roles enum + table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view own roles" ON public.user_roles;
CREATE POLICY "users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Testimonials moderation: require approval
ALTER TABLE public.testimonials ALTER COLUMN approved SET DEFAULT false;
UPDATE public.testimonials SET approved = false WHERE approved IS NULL;

-- Admins can do everything on testimonials
DROP POLICY IF EXISTS "admins view all testimonials" ON public.testimonials;
CREATE POLICY "admins view all testimonials" ON public.testimonials
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins update testimonials" ON public.testimonials;
CREATE POLICY "admins update testimonials" ON public.testimonials
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins delete testimonials" ON public.testimonials;
CREATE POLICY "admins delete testimonials" ON public.testimonials
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
