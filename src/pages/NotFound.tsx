import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <SEO title="Page not found — ResumeIQ" />
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
