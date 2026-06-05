ALTER FUNCTION public.validate_testimonial() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.update_user_streak() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_testimonial() FROM PUBLIC, anon, authenticated;