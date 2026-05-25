import { SITE_URL } from "./whatsapp";

type SeoInput = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
  jsonLd?: object | object[];
  type?: "website" | "article" | "product";
  noindex?: boolean;
  alternateLanguages?: Array<{ lang: string; url: string }>;
};

export function buildHead(input: SeoInput) {
  const canonical = input.canonical ? `${SITE_URL}${input.canonical}` : undefined;
  const ogImage = input.ogImage ?? `${SITE_URL}/og-image.jpg`;
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    if (input.title.length > 60) console.warn(`[seo] title >60 chars (${input.title.length}): ${input.title}`);
    if (input.description.length < 140 || input.description.length > 170) {
      console.warn(`[seo] description ${input.description.length} chars (target 140-170): ${input.title}`);
    }
  }
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:locale", content: "es_MX" },
    { property: "og:site_name", content: "Péptidos Mayoreo" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: ogImage },
  ];
  if (canonical) meta.push({ property: "og:url", content: canonical });
  if (input.noindex) meta.push({ name: "robots", content: "noindex,nofollow" });
  if (input.keywords?.length) {
    meta.push({ name: "keywords", content: input.keywords.join(", ") });
  }
  const links: Array<Record<string, string>> = [];
  if (canonical) links.push({ rel: "canonical", href: canonical });
  if (canonical) {
    links.push({ rel: "alternate", hrefLang: "es-MX", href: canonical });
    links.push({ rel: "alternate", hrefLang: "x-default", href: canonical });
  }
  if (input.alternateLanguages?.length) {
    for (const alt of input.alternateLanguages) {
      links.push({ rel: "alternate", hrefLang: alt.lang, href: alt.url });
    }
  }
  const scripts: Array<Record<string, string>> = [];
  if (input.jsonLd) {
    const arr = Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd];
    for (const obj of arr) {
      scripts.push({ type: "application/ld+json", children: JSON.stringify(obj) });
    }
  }
  return { meta, links, scripts };
}

export function mergeHead(...heads: ReturnType<typeof buildHead>[]) {
  return {
    meta: heads.flatMap((h) => h.meta ?? []),
    links: heads.flatMap((h) => h.links ?? []),
    scripts: heads.flatMap((h) => h.scripts ?? []),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Péptidos Mayoreo",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.jpg`,
    sameAs: [],
    description:
      "Distribuidor mayorista de péptidos en México. Mínimo 10 viales, pago seguro con Stripe, envío nacional.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
    },
    areaServed: { "@type": "Country", name: "Mexico" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Péptidos Mayoreo",
    url: SITE_URL,
    inLanguage: "es-MX",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/productos?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd(params: {
  city: string;
  state: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Péptidos Mayoreo - ${params.city}`,
    url: `${SITE_URL}${params.url}`,
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: params.city,
      containedInPlace: { "@type": "AdministrativeArea", name: params.state },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: params.city,
      addressRegion: params.state,
      addressCountry: "MX",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
