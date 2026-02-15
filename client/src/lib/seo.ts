import { useEffect } from "react";

type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
};

function setMetaTag(selector: string, content: string, attr: "name" | "property") {
  const element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
  if (element) {
    element.setAttribute("content", content);
  }
}

function setCanonical(url: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) {
    link.setAttribute("href", url);
  }
}

function setHreflangTags(basePath: string) {
  // Update hreflang tags for multilingual support with path-based URLs
  const languages = ['de', 'en', 'ru', 'uz'];

  // Remove existing language prefix from basePath
  let cleanPath = basePath;
  const pathSegments = basePath.split('/').filter(Boolean);
  if (['en', 'ru', 'uz'].includes(pathSegments[0])) {
    cleanPath = '/' + pathSegments.slice(1).join('/');
  }

  // Ensure path ends with /
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  languages.forEach(lang => {
    const hreflang = lang;
    const href = lang === 'de'
      ? `https://caravan-restaurant.de${cleanPath}`
      : `https://caravan-restaurant.de/${lang}${cleanPath}`;

    let link = document.querySelector<HTMLLinkElement>(`link[hreflang="${hreflang}"]`);
    if (link) {
      link.setAttribute("href", href);
    }
  });

  // Update x-default hreflang
  const defaultLink = document.querySelector<HTMLLinkElement>('link[hreflang="x-default"]');
  if (defaultLink) {
    defaultLink.setAttribute("href", `https://caravan-restaurant.de${cleanPath}`);
  }
}

export function useSeoMeta({ title, description, canonical }: SeoMeta) {
  useEffect(() => {
    document.title = title;
    setMetaTag("description", description, "name");
    setMetaTag("og:title", title, "property");
    setMetaTag("og:description", description, "property");
    setMetaTag("og:url", canonical, "property");
    setMetaTag("twitter:title", title, "name");
    setMetaTag("twitter:description", description, "name");
    setCanonical(canonical);

    // Extract base path from canonical URL for hreflang tags
    const basePath = canonical.replace('https://caravan-restaurant.de', '').split('?')[0];
    setHreflangTags(basePath);
  }, [title, description, canonical]);
}
