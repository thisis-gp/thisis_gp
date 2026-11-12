// Live numbers, fetched once at build time. If a source is down the line is simply left out.
import type { Slug } from "./projects";

const REPO_STARS = ["ctxd", "slimpdf"] as const;

type Json = Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any

async function getJson(url: string): Promise<Json> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "portfolio-build" } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

const fmt = (n: number) => n.toLocaleString("en-US");
const plural = (n: number, word: string) => `${fmt(n)} ${word}${n === 1 ? "" : "s"}`;

export async function getStats(): Promise<Record<Slug, string[]>> {
  const today = new Date().toISOString().slice(0, 10);
  const [npmMonth, npmRange, pyRecent, pyOverall, ...stars] = await Promise.all([
    getJson("https://api.npmjs.org/downloads/point/last-month/@dagurupriyan/ctxd"),
    getJson(`https://api.npmjs.org/downloads/range/2026-07-01:${today}/@dagurupriyan/ctxd`),
    getJson("https://pypistats.org/api/packages/slimpdf/recent"),
    getJson("https://pypistats.org/api/packages/slimpdf/overall?mirrors=false"),
    ...REPO_STARS.map((r) => getJson(`https://api.github.com/repos/thisis-gp/${r}`)),
  ]);
  const star = (i: number) => { const n = stars[i]?.stargazers_count ?? 0; return n > 0 ? [plural(n, "GitHub star")] : []; };
  const npmTotal = Array.isArray(npmRange?.downloads) ? npmRange.downloads.reduce((a: number, d: { downloads: number }) => a + d.downloads, 0) : null;
  const pyTotal = Array.isArray(pyOverall?.data) ? pyOverall.data.filter((d: { category: string }) => d.category === "without_mirrors").reduce((a: number, d: { downloads: number }) => a + d.downloads, 0) : null;
  return {
    ctxd: [...(npmTotal !== null && npmMonth ? [`${plural(npmTotal, "npm download")} since July, ${fmt(npmMonth.downloads)} in the last month`] : []), ...star(0)],
    slimpdf: [...(pyTotal !== null && pyRecent ? [`${plural(pyTotal, "PyPI download")} since June, ${fmt(pyRecent.data.last_month)} in the last month`] : []), ...star(1)],
    kanoon: ["Peer-reviewed: IEEE ICCIDS 2026 paper"],
    nila: ["3 people, 81 pull requests in 20 days"],
  };
}
