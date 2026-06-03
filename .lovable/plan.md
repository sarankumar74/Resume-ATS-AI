
# Migrate to Vite + React Router v6 SPA

Rewrite the project from TanStack Start (SSR) to a standard Vite + React SPA using React Router v6. Server-only logic moves to Supabase Edge Functions.

## What changes

### 1. Build & framework setup
- Replace `vite.config.ts` (TanStack preset) with a plain `@vitejs/plugin-react` config.
- Remove TanStack Start packages: `@tanstack/react-start`, `@lovable.dev/vite-tanstack-config`, nitro/cloudflare bits.
- Add `react-router-dom@6`.
- New entry: `index.html` + `src/main.tsx` + `src/App.tsx`.
- Delete `src/server.ts`, `src/start.ts`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/integrations/supabase/auth-middleware.ts`, `auth-attacher.ts`, `client.server.ts`, `src/lib/config.server.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`.

### 2. Routing (`src/routes/` → `src/pages/`)
Each TanStack route becomes a React Router page component. The new tree:

```text
src/
  App.tsx                  -> <BrowserRouter> with <Routes>
  pages/
    Index.tsx              -> /
    Login.tsx              -> /login
    Signup.tsx             -> /signup
    ResetPassword.tsx      -> /reset-password
    NotFound.tsx           -> *
    Dashboard.tsx          -> /dashboard      (protected)
    Upload.tsx             -> /upload         (protected)
    History.tsx            -> /history        (protected)
    Report.tsx             -> /report/:id     (protected)
    Settings.tsx           -> /settings       (protected)
  components/
    ProtectedRoute.tsx     -> guard wrapper (replaces _authenticated layout)
    SEO.tsx                -> react-helmet-async wrapper for per-page <title>/meta
```

- Auth guard reads Supabase session via `supabase.auth.getSession()` + `onAuthStateChange`; redirects to `/login` when missing.
- `Index.tsx` reads `?ref=<id>` from `useSearchParams` and stores it in `localStorage`.
- SEO meta moves from TanStack `head()` to `react-helmet-async` (`<SEO>` component on each page).

### 3. Server logic → Supabase Edge Functions
- `src/lib/analyze.functions.ts` (Lovable AI resume analysis) → `supabase/functions/analyze-resume/index.ts`. Client calls it via `supabase.functions.invoke('analyze-resume', { body: ... })`. Uses `LOVABLE_API_KEY` from edge function env.
- `src/routes/sitemap[.]xml.ts` (dynamic sitemap) → `supabase/functions/sitemap/index.ts` returning `text/xml`. Add a static `public/sitemap.xml` as a fallback that lists the main public pages (since SPAs can't serve XML at `/sitemap.xml` natively).
- `robots.txt` stays in `public/`.

### 4. SPA hosting plumbing
- Add `public/_redirects` (`/* /index.html 200`) for Netlify-style hosts.
- Add `vercel.json` with SPA rewrite for Vercel.
- Both are harmless on Lovable hosting.

### 5. Files preserved as-is
- `src/integrations/supabase/client.ts` (unchanged — already browser-side)
- `src/integrations/supabase/types.ts` (auto-generated)
- `src/components/ui/*` (all shadcn components)
- `src/components/referral-card.tsx`, `auth-shared.tsx`
- `src/lib/auth.tsx`, `src/lib/utils.ts`
- `src/styles.css`, `tailwind` setup
- `supabase/config.toml`, all existing migrations

## Trade-offs you accepted
- No SSR → first-paint SEO is weaker (search engines now rely on client-rendered content; Google handles this, but it's a downgrade from the previous setup).
- Dynamic sitemap moves to an edge function URL; we add a static fallback at `/sitemap.xml`.
- Auth check is client-side only (Supabase session in `localStorage`) — same security model as before since RLS still enforces all data access.

## Technical details

**Packages added:** `react-router-dom@^6`, `react-helmet-async`.
**Packages removed:** `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-router-devtools`, `@lovable.dev/vite-tanstack-config`, `nitro`, related cloudflare/h3 deps.
**Build:** standard `vite build` → `dist/` static output. Works on Vercel, Netlify, Cloudflare Pages, and Lovable hosting.

## Execution order (1 turn, after approval)
1. Write `supabase/functions/analyze-resume/index.ts` and deploy it.
2. Rewrite `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`.
3. Create all `src/pages/*.tsx` files (porting logic from the old `src/routes/*.tsx`).
4. Create `ProtectedRoute.tsx` and `SEO.tsx`.
5. Delete obsolete TanStack files.
6. Add `public/_redirects`, `vercel.json`, `public/sitemap.xml`.
7. Verify build.

This is a large single-turn change (~20 files). After approval I'll execute it in one batch.
