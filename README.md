# ResumeIQ

ResumeIQ is an AI-powered resume analysis app. It helps job seekers review a resume against applicant tracking system (ATS) criteria and, optionally, a specific job description. Users can review scores and suggestions, keep a scan history, and download reports.

## Features

- **Resume analysis:** ATS, job-description match, grammar, and formatting scores, plus strengths, weaknesses, missing keywords and skills, STAR suggestions, action-verb suggestions, and a prioritized improvement roadmap.
- **Resume input:** Paste text or upload PDF, DOCX, TXT, or Markdown files. PDF and DOCX text is extracted in the browser before analysis. Legacy `.doc` files are not supported.
- **Reports:** View saved analysis results and download a PDF report.
- **Account access:** Email/password sign-up and sign-in, password reset, and Google OAuth.
- **Dashboard and history:** View scan totals, score summaries, recent analyses, and past reports.
- **Activity streaks:** Track analysis activity and see a day-by-day history.
- **Profile:** Set a username and upload or change a profile picture.
- **Testimonials:** Submit a star rating and review after an analysis. Reviews require admin approval before public display; admins can moderate them.
- **Referrals:** Create and share a personal referral link.
- **Search metadata:** Page titles and descriptions, canonical URLs, Open Graph/Twitter metadata, `robots.txt`, and a sitemap.
- **Responsive interface:** Layouts for mobile, tablet, and desktop.

## Technology stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, TypeScript 5, Vite 7 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 4, shadcn/ui-style components, Radix UI primitives |
| Icons | Lucide React |
| Server state | TanStack Query |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| Backend and authentication | Lovable Cloud (Supabase), `@supabase/supabase-js` |
| Resume analysis | Supabase Edge Function calling the Lovable AI Gateway (`google/gemini-2.5-flash`) |
| PDF text extraction | `pdfjs-dist` |
| Word text extraction | `mammoth` |
| PDF report export | `jspdf` |
| SEO metadata | `react-helmet-async` |
| Hosting configuration | Vercel rewrite and Netlify-style `_redirects` fallback |

## Application pages

| Page | Path | Access |
| --- | --- | --- |
| Landing page | `/` | Public |
| Sign in | `/login` | Public |
| Sign up | `/signup` | Public |
| Password reset | `/reset-password` | Public |
| Dashboard | `/dashboard` | Signed in |
| New resume scan | `/upload` | Signed in |
| Scan history | `/history` | Signed in |
| Analysis report | `/report/:id` | Signed in; owned reports only |
| Streak history | `/streak` | Signed in |
| Settings | `/settings` | Signed in |
| Testimonial moderation | `/admin/testimonials` | Admin |

## Getting started

### Requirements

- Node.js 20 or newer (or a compatible Bun release)
- npm or Bun
- A configured Lovable Cloud project, or a compatible Supabase project for self-hosting

### Install dependencies

```bash
npm install
```

Or, with Bun:

```bash
bun install
```

### Configure environment variables

Create a local `.env` file (do not commit it) and set the public client configuration for your backend:

```env
VITE_SUPABASE_URL=https://your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use the project URL and publishable/anon key from your own backend project. Never put a service-role key, database password, AI secret, or other private credential in a `VITE_` variable; Vite embeds `VITE_` values in browser code.

### Run locally

```bash
npm run dev
```

Vite is configured to serve the app on port `8080` by default. Use the URL printed by the dev server.

### Build and preview

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Backend setup

The frontend uses the backend for authentication, user profiles, resume scans, streaks, testimonials, and avatar storage. Database migrations are in `supabase/migrations/`; review and apply them to the backend project before using the app. The migrations configure row-level security so signed-in users work with their own records, while testimonial moderation is restricted to admins.

Resume analysis is handled by `supabase/functions/analyze-resume/index.ts`. Deploy that Edge Function to the same backend used by the frontend and configure its AI gateway secret (`LOVABLE_API_KEY`) as a server-side function secret. Do not expose this secret in the frontend or commit it to the repository. The function validates the request, verifies the signed-in user, calls the AI model, and saves the analysis to `resume_scans`.

For a self-hosted backend, configure email authentication and Google OAuth in that backend. Add each deployed app origin (and local development origin) to the backend's allowed redirect URLs, and ensure the Google OAuth client callback is configured for that backend. Google OAuth credentials and redirect configuration are managed outside this repository.

To use the admin moderation page, provision the intended account with the admin role using a trusted backend-owner process. Do not grant admin access from client-side code or user-editable profile metadata.

## Deployment

This is a client-rendered Vite SPA and can be deployed to Vercel, Netlify, or another static host that supports SPA fallback routing.

### Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting environment settings.
- `vercel.json` rewrites app paths to `index.html` so direct links to application pages work.

### Netlify-style hosting

`public/_redirects` includes the SPA fallback. Configure the same build command, output directory, and public environment variables.

### Other static hosts

Set the build command to `npm run build`, publish `dist/`, provide the public backend environment variables at build time, and configure a catch-all rewrite to `/index.html`. The backend Edge Function and database are deployed separately from the frontend.

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run build:dev` | Build using Vite's development mode |
| `npm run preview` | Preview the built app locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format project files with Prettier |

## Project structure

```text
src/
  components/       Shared app components and UI primitives
  hooks/            Shared React hooks
  integrations/     Backend client and integration helpers
  lib/              Authentication, admin checks, and utilities
  pages/            Landing, auth, dashboard, scan, report, and settings pages
  types/            TypeScript declarations
  App.tsx           Client-side route definitions
  main.tsx          React app entry point
  styles.css        Global styles and design tokens
supabase/
  functions/        Edge Functions, including analyze-resume
  migrations/       Database schema, access policies, and triggers
public/             Static assets, sitemap, robots, and host fallback
```

## Privacy and security notes

- PDF/DOCX files are parsed in the browser; the extracted resume text and optional job description are sent to the analysis function and saved with the resulting scan.
- Resume scan records and profile data are protected by backend row-level security policies.
- Keep secrets server-side. Only publishable backend configuration belongs in frontend environment variables.
- Do not deploy the admin page as a substitute for backend access control; authorization must remain enforced by backend policies.

## License

No license file is currently included. Add a `LICENSE` file before distributing this repository with an open-source license.
