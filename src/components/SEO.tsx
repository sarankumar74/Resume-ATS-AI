import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
};

export function SEO({ title, description, canonical, jsonLd }: Props) {
  const path = canonical ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={path} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <link rel="canonical" href={path} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
