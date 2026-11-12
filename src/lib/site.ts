// One place for the facts every page, feed and schema block repeats.
// Set NEXT_PUBLIC_SITE_URL to the real address when you deploy so canonical links, the sitemap and the feeds all match.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thisis-gp.github.io/thisis_gp").replace(/\/$/, "");
// The site lives under a path on GitHub Pages. Local dev runs at the root, so this is empty there.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBase = (path: string) => `${BASE}${path}`;
// The browser build of the Java engine ships Nintendo sprites and sounds. It stays off until that is decided: set NEXT_PUBLIC_ENGINE_LIVE=1 to turn it on.
export const ENGINE_LIVE = process.env.NEXT_PUBLIC_ENGINE_LIVE === "1";
// Google Search Console HTML-tag token. Filled in once the property is added.
export const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_TOKEN ?? "";
export const NAME = "D A Gurupriyan";
export const EMAIL = "dagurupriyan@gmail.com";
export const TAGLINE = "Software engineer in Bangalore who finds real-world problems and builds the software that solves them.";

export const PROFILES = {
  github: "https://github.com/thisis-gp",
  linkedin: "https://www.linkedin.com/in/thisis-gp/",
  instagram: "https://instagram.com/_this.is_gp",
  x: "https://x.com/this_isGP",
  medium: "https://medium.com/@am400718",
  hashnode: "https://planbinsights.hashnode.dev",
} as const;

// Pages end in a slash (the site uses trailing slashes), files such as /llms.txt do not.
export const abs = (path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${/\.[a-z]+$/.test(p) || p.endsWith("/") ? p : `${p}/`}`;
};
