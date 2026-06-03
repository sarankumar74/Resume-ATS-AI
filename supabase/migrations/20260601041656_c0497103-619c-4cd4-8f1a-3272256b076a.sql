
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS profiles_referred_by_idx ON public.profiles(referred_by);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  ref_id uuid;
BEGIN
  BEGIN
    ref_id := NULLIF(NEW.raw_user_meta_data->>'referred_by','')::uuid;
  EXCEPTION WHEN others THEN
    ref_id := NULL;
  END;
  IF ref_id = NEW.id THEN ref_id := NULL; END IF;

  INSERT INTO public.profiles (id, email, username, referred_by)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)), ref_id);
  RETURN NEW;
END;
$function$;
