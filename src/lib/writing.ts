// Articles and research papers. New Hashnode posts are pulled in at build time, so this list grows without edits.
// Add a paper or an article that is not on Hashnode to CURATED below. Never list a paper without a link that proves it.

export type Piece = {
  kind: "article" | "paper";
  title: string;
  url: string;
  date: string; // ISO date
  venue: string;
  summary: string;
  authors?: string;
  doi?: string;
  role?: string;
};

const CURATED: Piece[] = [
  {
    kind: "paper",
    title: "AILSE: AI driven Legal Search Engine for Indian Supreme Court Cases",
    url: "https://ieeexplore.ieee.org/document/11407722",
    date: "2026-01-08",
    venue: "2026 9th International Conference on Computational Intelligence in Data Science (ICCIDS), Chennai",
    authors: "S. Lourdumarie Sophie, S. Siva Sathya, D. A. Gurupriyan",
    doi: "10.1109/ICCIDS69108.2026.11407722",
    role: "Co-author. I built the system the paper describes.",
    summary: "A legal search engine over Indian Supreme Court judgments. The system later grew into Kanoon, with hybrid retrieval, reranking and cited answers.",
  },
  {
    kind: "article",
    title: "Building a Retro Game with Amazon Q CLI",
    url: "https://planbinsights.hashnode.dev/building-a-retro-game-with-amazon-q-cli",
    date: "2025-06-19",
    venue: "Hashnode",
    summary: "How I made Cube Runner '84, a Geometry Dash-style retro game, with Amazon Q CLI and Pygame, using plain prompts in the terminal.",
  },
  {
    kind: "article",
    title: "Introducing Bun 1.0: The Node.js Game Changer",
    url: "https://planbinsights.hashnode.dev/introducing-bun-10-the-nodejs-game-changer",
    date: "2023-09-11",
    venue: "Hashnode",
    summary: "A look at Bun 1.0, the JavaScript runtime that aims to replace Node.js, and what it changes about building JavaScript apps.",
  },
];

const FEED = "https://planbinsights.hashnode.dev/rss.xml";
const stripSymbols = (t: string) => t.replace(/^[^\p{L}\p{N}]+/u, "").trim();

async function fromHashnode(): Promise<Piece[]> {
  try {
    const res = await fetch(FEED, { headers: { "User-Agent": "portfolio-build" } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap((m) => {
      const pick = (re: RegExp) => (m[1].match(re)?.[1] ?? "").trim();
      const title = stripSymbols(pick(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || pick(/<title>([\s\S]*?)<\/title>/));
      const url = pick(/<link>([\s\S]*?)<\/link>/).split("?")[0];
      const date = new Date(pick(/<pubDate>([\s\S]*?)<\/pubDate>/));
      if (!title || !url || Number.isNaN(date.getTime())) return [];
      const summary = pick(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return [{ kind: "article" as const, title, url, date: date.toISOString().slice(0, 10), venue: "Hashnode", summary }];
    });
  } catch {
    return [];
  }
}

export async function getWriting(): Promise<Piece[]> {
  const known = new Set(CURATED.map((p) => p.url));
  const fresh = (await fromHashnode()).filter((p) => !known.has(p.url));
  return [...CURATED, ...fresh].sort((a, b) => b.date.localeCompare(a.date));
}

export const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
