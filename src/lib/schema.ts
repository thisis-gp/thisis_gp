// schema.org graphs. Built from the same data as the pages, so they cannot drift out of date.
import { FAQ } from "./faq";
import { NAME, PROFILES, SITE_URL, TAGLINE, abs } from "./site";
import type { Piece } from "./writing";

const PERSON_ID = `${SITE_URL}/#person`;

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: NAME,
  alternateName: ["Gurupriyan D A", "Gurupriyan", "thisis-gp"],
  url: SITE_URL,
  image: abs("/social.png"),
  description: TAGLINE,
  jobTitle: "Software Development Engineer I",
  worksFor: { "@type": "Organization", name: "Nova Benefits" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Pondicherry University" },
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  knowsAbout: ["Software engineering", "Retrieval-augmented generation", "Model Context Protocol", "Android development", "Data engineering", "Python", "TypeScript", "Kotlin"],
  award: "Best Intervention Award, TYCL Mental Health Exhibition 2024",
  hasCredential: { "@type": "EducationalOccupationalCredential", name: "Amazon ML Summer School 2024 (selected participant)", credentialCategory: "program selection" },
  sameAs: Object.values(PROFILES),
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: NAME,
  url: SITE_URL,
  description: TAGLINE,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
});

export const faqPage = {
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const pieceNode = (p: Piece) =>
  p.kind === "paper"
    ? { "@type": "ScholarlyArticle", name: p.title, headline: p.title, url: p.url, datePublished: p.date, isPartOf: { "@type": "Periodical", name: p.venue }, author: { "@id": PERSON_ID }, ...(p.doi ? { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: p.doi } } : {}), description: p.summary }
    : { "@type": "BlogPosting", headline: p.title, url: p.url, datePublished: p.date, author: { "@id": PERSON_ID }, publisher: { "@id": PERSON_ID }, description: p.summary, inLanguage: "en" };
