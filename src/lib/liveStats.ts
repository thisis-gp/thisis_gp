// Live refresh of the numbers in the visitor's browser. The build-time values are the fallback.
// Only sources that allow cross-origin requests are used: npm, GitHub and the shields.io JSON feed (which carries PyPI's monthly count).
import type { Slug } from "./projects";

const fmt = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, word: string) => `${fmt(n)} ${word}${n === 1 ? "" : "s"}`;

async function json(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url);
    return res.ok ? ((await res.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const stars = async (repo: string) => {
  const n = ((await json(`https://api.github.com/repos/thisis-gp/${repo}`))?.stargazers_count as number | undefined) ?? 0;
  return n > 0 ? [plural(n, "GitHub star")] : [];
};

export async function fetchLive(slug: Slug): Promise<string[]> {
  if (slug === "ctxd") {
    const today = new Date().toISOString().slice(0, 10);
    const [month, range, star] = await Promise.all([
      json("https://api.npmjs.org/downloads/point/last-month/@dagurupriyan/ctxd"),
      json(`https://api.npmjs.org/downloads/range/2026-07-01:${today}/@dagurupriyan/ctxd`),
      stars("ctxd"),
    ]);
    const days = (range?.downloads as { downloads: number }[] | undefined) ?? [];
    const total = days.reduce((sum, d) => sum + d.downloads, 0);
    const m = month?.downloads as number | undefined;
    return [...(m !== undefined && days.length ? [`${plural(total, "npm download")} since July, ${fmt(m)} in the last month`] : []), ...star];
  }
  if (slug === "slimpdf") {
    const [shield, star] = await Promise.all([json("https://img.shields.io/pypi/dm/slimpdf.json"), stars("slimpdf")]);
    const m = parseInt(String(shield?.value ?? "").replace(/,/g, ""), 10);
    return [...(Number.isFinite(m) ? [`${plural(m, "PyPI download")} in the last month`] : []), ...star];
  }
  return [];
}
